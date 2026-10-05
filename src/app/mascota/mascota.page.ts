import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {addCircle, createOutline, add, close, cameraOutline} from 'ionicons/icons';
import {
  IonContent, IonBreadcrumbs, IonBreadcrumb, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonChip, IonLabel,
  IonButton, IonButtons, IonIcon, IonFab, IonFabButton, IonModal, IonHeader, IonToolbar,
  IonTitle, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSpinner, ToastController
} from '@ionic/angular';
import { MascotaService } from '../services/mascota.service';
import {MascotaTipo, MascotaEstatus, Mascota, MascotaRequest} from "../models/mascota.model";
import {UploadService} from "../services/upload.service";
import {resolverImagen} from "../services/imagen";
import {map, of, switchMap} from "rxjs";

interface MascotaForm {
  id?: number;
  nombre: string;
  edad: number | null;
  tipo: MascotaTipo;
  estatus: MascotaEstatus;
  descripcion: string;
  imagen: string;
  etiquetas: string;
}

@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.page.html',
  styleUrls: ['./mascota.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonBreadcrumbs, IonBreadcrumb, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonChip, IonLabel,
    IonButton, IonButtons, IonIcon, IonFab, IonFabButton, IonModal, IonHeader, IonToolbar,
    IonTitle, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSpinner
  ]
})
export class MascotaPage {
  private mascotaService = inject(MascotaService);
  private uploadService = inject(UploadService);
  private toastCtrl = inject(ToastController);
  protected readonly imgSrc = resolverImagen;

  myPets = signal<Mascota[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  isModalOpen = signal(false);

  fotoPreview = signal<string | null>(null);
  private fotoPendiente: Blob | null = null;
  selectedPet: MascotaForm | null = null;

  constructor() {
    addIcons({ addCircle, createOutline, add, close, cameraOutline });
  }

  ionViewWillEnter() {
    this.loadPets();
  }

  get isEditing(): boolean {
    return this.selectedPet?.id !== undefined;
  }

  loadPets() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.mascotaService.getMisMascotas().subscribe({
      next: (pets) => {
        this.myPets.set(pets);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(this.mensajeError(err, 'No se pudieron cargar tus mascotas'));
      }
    });
  }

  addPet() {
    this.selectedPet = {
      nombre: '',
      edad: null,
      tipo: 'perros',
      estatus: 'Disponible',
      descripcion: '',
      imagen: '',
      etiquetas: ''
    };
    this.fotoPendiente = null;
    this.fotoPreview.set(null);
    this.isModalOpen.set(true);
    this.isModalOpen.set(true);
  }

  openEditModal(pet: Mascota) {
    this.selectedPet = {
      id: pet.id,
      nombre: pet.nombre,
      edad: pet.edad,
      tipo: pet.tipo,
      estatus: pet.estatus,
      descripcion: pet.descripcion,
      imagen: pet.imagen ?? '',
      etiquetas: pet.etiquetas.join(', ')
    };
    this.fotoPendiente = null;
    this.fotoPreview.set(resolverImagen(pet.imagen) || null);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedPet = null;
    this.fotoPendiente = null;
    this.fotoPreview.set(null);
  }

  async tomarFoto() {
    try {
      const foto = await this.uploadService.tomarFoto();
      if (!foto) return; // el usuario canceló
      this.fotoPendiente = foto.blob;
      this.fotoPreview.set(foto.previewUrl);
    } catch {
      await this.showToast('No se pudo abrir la cámara', 'danger');
    }
  }

  savePetChanges() {
    const form = this.selectedPet;
    if (!form || this.saving()) return;

    const editando = form.id !== undefined;
    this.saving.set(true);

    // 1) Si hay foto nueva se sube primero; si no, se conserva la imagen que ya tenía
    const imagen$ = this.fotoPendiente
      ? this.uploadService.subirFotoMascota(this.fotoPendiente).pipe(map((r) => r.url))
      : of(form.imagen.trim());

    imagen$
      .pipe(
        switchMap((imagen) => {
          const payload: MascotaRequest = {
            nombre: form.nombre.trim(),
            edad: Number(form.edad),
            tipo: form.tipo,
            estatus: form.estatus,
            descripcion: form.descripcion.trim(),
            imagen,
            etiquetas: form.etiquetas.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
          };

          return editando
            ? this.mascotaService.updateMascota(form.id!, payload)
            : this.mascotaService.createMascota(payload);
        })
      )
      .subscribe({
        next: async () => {
          this.saving.set(false);
          this.closeModal();
          this.loadPets();
          await this.showToast(editando ? 'Mascota actualizada' : 'Mascota publicada', 'success');
        },
        error: async (err) => {
          this.saving.set(false);
          await this.showToast(this.mensajeError(err, 'No se pudo guardar la mascota'), 'danger');
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
