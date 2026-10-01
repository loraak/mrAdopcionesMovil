import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonFab, IonFabButton, IonButtons, IonModal, IonInput, IonTextarea, IonBreadcrumb, IonBreadcrumbs,
  IonBadge, IonCardHeader, IonCardTitle, IonChip
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircle, createOutline, add, close } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-pets',
  templateUrl: './mascota.page.html',
  styleUrls: ['./mascota.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonLabel, RouterLink,
    IonSelect, IonSelectOption, IonButton, IonIcon, IonFab, IonFabButton,
    IonButtons, IonModal, IonInput, IonTextarea, IonBreadcrumb, IonBreadcrumbs, IonBadge, IonCardHeader, IonCardTitle, IonChip
  ]
})
export class MascotaPage {
  myPets = [
    {
      id: 1,
      name: 'Firulais',
      age: 2,
      description: 'Muy sociable y cariñoso',
      imageUrl: 'assets/img/quemiedo.jpg',
      status: 'Disponible',
      tags: ['Vacunado', 'Esterilizado']
    },
    {
      id: 2,
      name: 'Michi',
      age: 1,
      description: 'Le encanta dormir bajo el sol',
      imageUrl: 'assets/img/floppa.jpg',
      status: 'En proceso',
      tags: ['Tranquilo']
    }
  ];

  isModalOpen = false;
  selectedPet: any = null;

  constructor() {
    addIcons({ addCircle, createOutline, add, close });
  }

  addPet() {
    console.log('Navegar a formulario de subir mascota');
  }

  openEditModal(pet: any) {
    // Copia los datos para no modificar el objeto original si no guarda
    this.selectedPet = { ...pet };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedPet = null;
  }

  savePetChanges() {
    if (this.selectedPet) {
      const index = this.myPets.findIndex(p => p.id === this.selectedPet.id);
      if (index !== -1) {
        this.myPets[index] = { ...this.selectedPet };
      }
    }
    this.closeModal();
  }

  onStatusChange(pet: any) {
    console.log(`Estado de ${pet.name} actualizado a: ${pet.status}`);
  }
}
