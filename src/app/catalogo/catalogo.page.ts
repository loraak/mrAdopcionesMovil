import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonContent, IonBreadcrumbs, IonBreadcrumb, IonSegment, IonSegmentButton, IonLabel,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonBadge, IonChip, IonButton, IonSpinner
} from '@ionic/angular';
import { MascotaService } from '../services/mascota.service';
import { Mascota } from '../models/mascota.model';
import {resolverImagen} from "../services/imagen";

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonBreadcrumbs, IonBreadcrumb, IonSegment, IonSegmentButton, IonLabel,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonBadge, IonChip, IonButton, IonSpinner
  ]
})
export class CatalogoPage {
  private mascotaService = inject(MascotaService);
  private sub?: Subscription;

  protected readonly imgSrc = resolverImagen;

  selectedCategory = 'todos';

  filteredPets = signal<Mascota[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  ionViewWillEnter() {
    this.filterPets();
  }

  filterPets() {
    this.sub?.unsubscribe();
    this.loading.set(true);
    this.errorMessage.set('');

    this.sub = this.mascotaService.getMascotas(this.selectedCategory).subscribe({
      next: (pets) => {
        this.filteredPets.set(pets);
        this.loading.set(false);
      },
      error: (err) => {
        this.filteredPets.set([]);
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 0
            ? 'No se pudo conectar con el servidor'
            : err.error?.message ?? 'No se pudo cargar el catálogo'
        );
      }
    });
  }
}
