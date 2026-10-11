import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  mailOutline, callOutline, locationOutline, checkmarkCircleOutline, closeCircleOutline
} from 'ionicons/icons';
import {
  IonContent, IonBreadcrumbs, IonBreadcrumb, IonGrid, IonRow, IonCol, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton, IonSpinner, ToastController
} from '@ionic/angular';
import {SolicitudService} from "../../services/solicitud.service";
import {Solicitud} from "../../models/solicitud.model";

@Component({
  selector: 'app-solicitud-adopcion',
  templateUrl: './solicitud-adopcion.page.html',
  styleUrls: ['./solicitud-adopcion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, IonContent, IonBreadcrumbs, IonBreadcrumb,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonIcon, IonButton, IonSpinner
  ]
})
export class SolicitudAdopcionPage {
  private solicitudService = inject(SolicitudService);
  private toastCtrl = inject(ToastController);

  solicitudes = signal<Solicitud[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  updatingId = signal<number | null>(null); // solicitud que se está procesando

  constructor() {
    addIcons({ mailOutline, callOutline, locationOutline, checkmarkCircleOutline, closeCircleOutline });
  }

  // Cada vez que el donante entra, se recargan las solicitudes
  ionViewWillEnter() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.solicitudService.getRecibidas().subscribe({
      next: (lista) => {
        this.solicitudes.set(lista);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(this.mensajeError(err, 'No se pudieron cargar las solicitudes'));
      }
    });
  }

  updateStatus(req: Solicitud, nuevoEstatus: 'Aceptada' | 'Rechazada') {
    if (this.updatingId() !== null) return;
    this.updatingId.set(req.id);

    this.solicitudService.cambiarEstatus(req.id, nuevoEstatus).subscribe({
      next: async (actualizada) => {
        this.solicitudes.update((lista) => lista.map((s) => (s.id === actualizada.id ? actualizada : s)));
        this.updatingId.set(null);
        await this.showToast(
          nuevoEstatus === 'Aceptada'
            ? `Solicitud aceptada. ${req.mascotaNombre} quedó "En proceso".`
            : 'Solicitud rechazada.',
          'success'
        );
      },
      error: async (err) => {
        this.updatingId.set(null);
        await this.showToast(this.mensajeError(err, 'No se pudo actualizar la solicitud'), 'danger');
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
