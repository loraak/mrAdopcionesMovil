import { Component, OnDestroy, computed, inject, signal, viewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription, catchError, switchMap, timer } from 'rxjs';
import { addIcons } from 'ionicons';
import { arrowBack, send, trashOutline } from 'ionicons/icons';
import {
  IonContent, IonButton, IonIcon, IonTextarea, IonSpinner, ToastController, AlertController
} from '@ionic/angular';
import {ChatService} from "../../services/chat.service";
import {ChatInfo, Mensaje} from "../../models/chat.model";

const INTERVALO_MS = 4000; // cada cuánto se consultan mensajes nuevos mientras el chat está abierto

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonIcon, IonTextarea, IonSpinner]
})
export class ChatPage implements OnDestroy {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private chatService = inject(ChatService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  private content = viewChild(IonContent);
  private solicitudId = 0;
  private pollSub?: Subscription;

  readonly maxMensaje = 500;

  info = signal<ChatInfo | null>(null);
  mensajes = signal<Mensaje[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  sinConexion = signal(false);
  enviando = signal(false);

  texto = ''; // lo que se está escribiendo (ngModel)

  // Contadores de mensajes enviados por cada participante (de los que están visibles)
  enviadosPorMi = computed(() => this.mensajes().filter((m) => m.propio).length);
  enviadosPorOtro = computed(() => this.mensajes().length - this.enviadosPorMi());

  private ultimoId = computed(() => {
    const lista = this.mensajes();
    return lista.length ? lista[lista.length - 1].id : 0;
  });

  constructor() {
    addIcons({ arrowBack, send, trashOutline });
  }

  ionViewWillEnter() {
    this.solicitudId = Number(this.route.snapshot.paramMap.get('id'));
    this.info.set(null);
    this.mensajes.set([]);
    this.errorMessage.set('');
    this.sinConexion.set(false);
    this.texto = '';

    this.cargarInfo();
    this.cargarMensajes();
  }

  // Al salir del chat se deja de consultar: no hay peticiones en segundo plano
  ionViewWillLeave() {
    this.detenerPolling();
  }

  ngOnDestroy() {
    this.detenerPolling();
  }

  volver() {
    this.location.back();
  }

  // ---------- envío ----------

  onEnter(event: KeyboardEvent) {
    if (event.shiftKey) return; // Shift + Enter inserta un salto de línea
    event.preventDefault();
    this.enviar();
  }

  enviar() {
    const contenido = this.texto.trim();
    if (!contenido || this.enviando()) return; // nunca se envían mensajes vacíos

    this.enviando.set(true);
    this.chatService.enviar(this.solicitudId, contenido).subscribe({
      next: (mensaje) => {
        this.texto = '';
        this.enviando.set(false);
        this.agregar([mensaje]);
        this.aviso('Mensaje enviado');
      },
      error: (err) => {
        this.enviando.set(false);
        this.aviso(this.mensajeError(err), 'danger', 2500);
      }
    });
  }

  // ---------- limpiar historial ----------

  async limpiarHistorial() {
    const alerta = await this.alertCtrl.create({
      header: 'Limpiar historial',
      message: 'Se ocultarán los mensajes actuales solo para ti. La otra persona seguirá viéndolos.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Limpiar', role: 'destructive', handler: () => this.confirmarLimpieza() }
      ]
    });
    await alerta.present();
  }

  private confirmarLimpieza() {
    this.chatService.limpiar(this.solicitudId).subscribe({
      next: () => {
        this.mensajes.set([]);
        this.aviso('Historial limpiado');
      },
      error: (err) => this.aviso(this.mensajeError(err), 'danger', 2500)
    });
  }

  // ---------- carga y consulta periódica ----------

  private cargarInfo() {
    this.chatService.getInfo(this.solicitudId).subscribe({
      next: (info) => this.info.set(info),
      error: (err) => this.errorMessage.set(this.mensajeError(err))
    });
  }

  private cargarMensajes() {
    this.loading.set(true);
    this.chatService.getMensajes(this.solicitudId, 0).subscribe({
      next: (lista) => {
        this.mensajes.set(lista);
        this.loading.set(false);
        this.irAlFinal();
        this.iniciarPolling();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(this.mensajeError(err));
      }
    });
  }

  private iniciarPolling() {
    this.detenerPolling();

    this.pollSub = timer(INTERVALO_MS, INTERVALO_MS)
      .pipe(
        // switchMap cancela la consulta anterior si aún no terminó
        switchMap(() =>
          this.chatService.getMensajes(this.solicitudId, this.ultimoId()).pipe(
            catchError(() => {
              this.sinConexion.set(true); // se sigue intentando en el siguiente ciclo
              return EMPTY;
            })
          )
        )
      )
      .subscribe((nuevos) => {
        this.sinConexion.set(false);
        this.agregar(nuevos);
      });
  }

  private detenerPolling() {
    this.pollSub?.unsubscribe();
    this.pollSub = undefined;
  }

  // Agrega mensajes sin duplicar (un mensaje enviado puede llegar también por la consulta periódica)
  private agregar(nuevos: Mensaje[]) {
    const existentes = new Set(this.mensajes().map((m) => m.id));
    const sinRepetir = nuevos.filter((m) => !existentes.has(m.id));
    if (sinRepetir.length === 0) return;

    this.mensajes.update((lista) => [...lista, ...sinRepetir]);
    this.irAlFinal();
  }

  private irAlFinal() {
    setTimeout(() => this.content()?.scrollToBottom(250), 50);
  }

  // ---------- utilidades ----------

  // Mensajes fijos: no se muestra texto técnico que mande el servidor
  private mensajeError(err: any): string {
    if (err.status === 0) return 'No se pudo conectar con el servidor.';
    if (err.status === 403 || err.status === 404) return 'Esta conversación no está disponible.';
    if (err.status === 400) return 'El mensaje no es válido.';
    return 'Ocurrió un error. Intenta de nuevo.';
  }

  private async aviso(message: string, color: 'success' | 'danger' = 'success', duration = 1200) {
    const toast = await this.toastCtrl.create({ message, color, duration, position: 'top' });
    await toast.present();
  }
}
