import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent, IonBreadcrumbs, IonBreadcrumb, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonBadge, IonChip, IonLabel, IonButton, IonSpinner, IonTextarea, ToastController
} from '@ionic/angular';
import {AuthService} from "../../services/auth.service";
import {MascotaService} from "../../services/mascota.service";
import {SolicitudService} from "../../services/solicitud.service";
import {resolverImagen} from "../../services/imagen";
import {Mascota} from "../../models/mascota.model";

@Component({
  selector: 'app-mascota-detalle',
  templateUrl: './catalogo-detalle.page.html',
  styleUrls: ['../catalogo/catalogo.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, IonContent, IonBreadcrumbs, IonBreadcrumb,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonChip, IonLabel,
    IonButton, IonSpinner, IonTextarea
  ]
})
export class MascotaDetallePage {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private mascotaService = inject(MascotaService);
  private solicitudService = inject(SolicitudService);
  private toastCtrl = inject(ToastController);

  protected readonly imgSrc = resolverImagen;

  mascota = signal<Mascota | null>(null);
  loading = signal(false);
  errorMessage = signal('');
  sending = signal(false);
  enviada = signal(false);

  mensaje = ''; // texto del formulario (ngModel)

  get isLoggedIn() { return this.auth.isLoggedIn(); }
  // Usa el nombre de campo que tenga tu UsuarioResponse (role o rol)
  get esAdoptante() { return this.auth.currentUser()?.rol === 'ADOPTANTE'; }

  ionViewWillEnter() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.mensaje = '';
    this.enviada.set(false);
    this.cargar(id);
  }

  private cargar(id: number) {
    this.loading.set(true);
    this.errorMessage.set('');

    this.mascotaService.getMascotaById(id).subscribe({
      next: (m) => {
        this.mascota.set(m);
        this.loading.set(false);
      },
      error: (err) => {
        this.mascota.set(null);
        this.loading.set(false);
        this.errorMessage.set(this.mensajeError(err, 'No se pudo cargar la mascota'));
      }
    });
  }

  solicitar(mascotaId: number) {
    if (this.sending()) return;
    this.sending.set(true);

    this.solicitudService.crear(mascotaId, this.mensaje.trim()).subscribe({
      next: async () => {
        this.sending.set(false);
        this.enviada.set(true);
        await this.showToast('Solicitud enviada', 'success');
      },
      error: async (err) => {
        this.sending.set(false);
        await this.showToast(this.mensajeError(err, 'No se pudo enviar la solicitud'), 'danger');
      }
    });
  }

  private mensajeError(err: any, porDefecto: string): string {
    if (err.status === 0) return 'No se pudo conectar con el servidor';
    return err.error?.message ?? porDefecto;
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, color, duration: 3000, position: 'top' });
    await toast.present();
  }
}
