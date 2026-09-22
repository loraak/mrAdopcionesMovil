import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonLabel
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline, homeOutline, pawOutline, informationCircleOutline, newspaperOutline } from 'ionicons/icons';

@Component({
  selector: 'app-main-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonLabel
  ]
})
export class MainLayoutPage {
  isLoggedIn = false;

  constructor() {
    addIcons({ logOutOutline, homeOutline, pawOutline, informationCircleOutline, newspaperOutline });
  }

  logout() {
    this.isLoggedIn = false;
  }
}
