import { Component, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, locationOutline, businessOutline } from 'ionicons/icons';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonIcon, IonLabel
} from '@ionic/angular';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardContent, IonItem, IonIcon, IonLabel]
})
export class PerfilPage {
  private auth = inject(AuthService);

  user = this.auth.currentUser;

  errorMessage = signal('');

  constructor() {
    addIcons({ mailOutline, callOutline, locationOutline, businessOutline });
  }

  ionViewWillEnter() {
    this.errorMessage.set('');

    this.auth.me().subscribe({
      error: (err) => {
        if (err.status === 401) return; // lo maneja el interceptor
        this.errorMessage.set(
          err.status === 0
            ? 'No se pudo conectar con el servidor. Se muestran los últimos datos guardados.'
            : 'No se pudo actualizar tu perfil.'
        );
      }
    });
  }
}
