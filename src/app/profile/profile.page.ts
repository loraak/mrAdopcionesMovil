import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol, IonCardHeader,
  IonCardTitle, IonBadge, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, locationOutline, businessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol, IonCardHeader,
    IonCardTitle, IonBadge, IonButton
  ]
})
export class ProfilePage {
  // Cambia el rol a 'ADOPTANTE' para ver cómo se oculta la sección inferior
  user = {
    name: 'Karol Vázquez',
    email: 'karol@mradopciones.com',
    phone: '+52 468 103 3370',
    role: 'DONANTE',
    location: 'Querétaro, Qro.',
    organization: 'Refugio Esperanza'
  };

  myPets = [
    { id: 1, name: 'Firulais', imageUrl: 'assets/img/quemiedo.jpg', status: 'Buscando hogar' },
    { id: 2, name: 'Michi', imageUrl: 'assets/img/floppa.jpg', status: 'En proceso' }
  ];

  constructor() {
    addIcons({ mailOutline, callOutline, locationOutline, businessOutline });
  }
}
