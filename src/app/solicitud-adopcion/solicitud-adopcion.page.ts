import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonBreadcrumbs, IonBreadcrumb, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, locationOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

interface AdoptionRequest {
  id: number;
  applicantName: string;
  petName: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  status: 'Pendiente' | 'Aceptada' | 'Rechazada';
}

@Component({
  selector: 'app-solicitud-adopcion',
  templateUrl: './solicitud-adopcion.page.html',
  styleUrls: ['./solicitud-adopcion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, IonContent, IonBreadcrumbs, IonBreadcrumb,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonIcon, IonButton
  ]
})
export class SolicitudAdopcionPage {
  requests: AdoptionRequest[] = [
    {
      id: 1,
      applicantName: 'Ana Martínez',
      petName: 'Firulais',
      email: 'ana.m@gmail.com',
      phone: '+52 442 987 6543',
      location: 'Querétaro, Qro.',
      message: 'Tengo un patio amplio y muchas ganas de darle un hogar lleno de amor.',
      status: 'Pendiente'
    },
    {
      id: 2,
      applicantName: 'Carlos Gómez',
      petName: 'Michi',
      email: 'carlos.g@gmail.com',
      phone: '+52 442 123 7890',
      location: 'Juriquilla, Qro.',
      message: 'Vivo solo en departamento pero trabajo desde casa y tengo experiencia con gatos.',
      status: 'Pendiente'
    }
  ];

  constructor() {
    addIcons({ mailOutline, callOutline, locationOutline, checkmarkCircleOutline, closeCircleOutline });
  }

  updateStatus(req: AdoptionRequest, newStatus: 'Aceptada' | 'Rechazada') {
    req.status = newStatus;
  }
}
