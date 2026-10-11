import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  IonContent, IonBreadcrumbs, IonBreadcrumb, IonGrid, IonRow, IonCol, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonSpinner,
  IonRefresher, IonRefresherContent
} from '@ionic/angular';
import {SolicitudService} from "../../services/solicitud.service";
import {Solicitud} from "../../models/solicitud.model";

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './solicitudes-respuesta.page.html',
  styleUrls: ['../solicitud-adopcion/solicitud-adopcion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, IonContent, IonBreadcrumbs, IonBreadcrumb,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonSpinner, IonRefresher, IonRefresherContent
  ]
})
export class MisSolicitudesPage {
  private solicitudService = inject(SolicitudService);

  solicitudes = signal<Solicitud[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  ionViewWillEnter() {
    this.cargar();
  }

  refrescar(event: CustomEvent) {
    this.cargar(() => (event.target as HTMLIonRefresherElement).complete());
  }

  private cargar(alTerminar?: () => void) {
    if (!alTerminar) this.loading.set(true);
    this.errorMessage.set('');

    this.solicitudService
      .getMias()
      .pipe(finalize(() => alTerminar?.()))
      .subscribe({
        next: (lista) => {
          this.solicitudes.set(lista);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err.status === 0
              ? 'No se pudo conectar con el servidor'
              : err.error?.message ?? 'No se pudieron cargar tus solicitudes'
          );
        }
      });
  }
}
