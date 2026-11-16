import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonSpinner, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton,
  IonLabel, ToastController
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { ReporteService } from '../../services/reporte.service';
import { Reporte } from '../../models/reporte.model';

@Component({
  selector: 'app-admin-reportes',
  templateUrl: './admin.page.html',
  styleUrls: ['../solicitud-adopcion/solicitud-adopcion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton, IonSpinner, IonRefresher, IonRefresherContent, IonSegment,
    IonSegmentButton, IonLabel
  ]
})
export class AdminReportesPage {
  private reporteService = inject(ReporteService);
  private toastCtrl = inject(ToastController);

  reportes = signal<Reporte[]>([]);
  filtro = signal<'Pendiente' | 'Todos'>('Pendiente');
  loading = signal(false);
  errorMessage = signal('');
  updatingId = signal<number | null>(null);

  visibles = computed(() =>
    this.filtro() === 'Todos' ? this.reportes() : this.reportes().filter((r) => r.estatus === 'Pendiente')
  );

  ionViewWillEnter() {
    this.cargar();
  }

  refrescar(event: CustomEvent) {
    this.cargar(() => (event.target as HTMLIonRefresherElement).complete());
  }

  cambiarFiltro(event: CustomEvent) {
    this.filtro.set(event.detail.value);
  }

  clase(r: Reporte): string {
    return r.estatus === 'Pendiente' ? 'pendiente' : 'aceptada'; // reutiliza los colores existentes
  }

  private cargar(alTerminar?: () => void) {
    if (!alTerminar) this.loading.set(true);
    this.errorMessage.set('');

    this.reporteService.listar().pipe(finalize(() => alTerminar?.())).subscribe({
      next: (lista) => { this.reportes.set(lista); this.loading.set(false); },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.status === 0 ? 'No se pudo conectar con el servidor' : 'No se pudieron cargar los reportes');
      }
    });
  }

  marcarRevisado(r: Reporte) {
    if (this.updatingId() !== null) return;
    this.updatingId.set(r.id);

    this.reporteService.marcarRevisado(r.id).subscribe({
      next: async (actualizado) => {
        this.reportes.update((l) => l.map((x) => (x.id === actualizado.id ? actualizado : x)));
        this.updatingId.set(null);
        await this.showToast('Reporte marcado como revisado', 'success');
      },
      error: async () => {
        this.updatingId.set(null);
        await this.showToast('No se pudo actualizar el reporte', 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, color, duration: 2500, position: 'top' });
    await toast.present();
  }
}
