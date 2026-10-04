import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
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
  IonLabel,
  IonPopover,
  IonList,
  IonItem
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logOutOutline, homeOutline, pawOutline, informationCircleOutline, newspaperOutline, personCircleOutline, personOutline } from 'ionicons/icons';
import {AuthService} from "../../services/auth.service";

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
    IonLabel,
    IonPopover,
    IonList,
    IonItem
  ]
})
export class MainLayoutPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({
      logOutOutline, homeOutline, pawOutline, informationCircleOutline, newspaperOutline, personCircleOutline, personOutline
    });
  }

  get isLoggedIn() { return this.auth.isLoggedIn(); }
  get username() { return this.auth.currentUser()?.username ?? ''; }
  get rolLabel() { return this.auth.currentUser()?.rol === 'DONANTE' ? 'Donante': 'Adoptante'; }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/app/home');
  }
}
