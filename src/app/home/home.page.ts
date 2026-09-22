import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  paw,
  home,
  people,
  informationCircleOutline,
  newspaperOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class HomePage {
  constructor() {
    addIcons({
      paw,
      home,
      people,
      informationCircleOutline,
      newspaperOutline,
      personOutline
    });
  }
}
