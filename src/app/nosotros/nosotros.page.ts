import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonBreadcrumbs, IonBreadcrumb,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonIcon, IonAccordionGroup, IonAccordion, IonItem, IonLabel,
  IonInput, IonTextarea, IonButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  star, heart, helpCircle, mail, call, paperPlane,
  logoFacebook, logoInstagram, logoTwitter
} from 'ionicons/icons';

@Component({
  selector: 'app-about-us',
  templateUrl: './nosotros.page.html',
  styleUrls: ['./nosotros.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonBreadcrumbs, IonBreadcrumb,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonIcon, IonAccordionGroup, IonAccordion, IonItem, IonLabel,
    IonInput, IonTextarea, IonButton
  ]
})
export class NosotrosPage {
  constructor() {
    addIcons({
      star, heart, helpCircle, mail, call, paperPlane,
      logoFacebook, logoInstagram, logoTwitter
    });
  }

  sendMessage() {
    console.log('Mensaje enviado');
  }
}
