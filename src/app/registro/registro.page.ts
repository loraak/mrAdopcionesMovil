import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonRouterLink,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './registro.page.html',
  styleUrls: ['../login/login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonRouterLink,
    IonSegment,
    IonSegmentButton,
    IonLabel
  ]
})
export class RegistroPage {
  // Rol seleccionado por defecto
  role: 'ADOPTANTE' | 'DONANTE' = 'ADOPTANTE';

  // Datos comunes
  username = '';
  email = '';
  password = '';

  // Datos de Adoptante
  phone = '';
  occupation = '';

  // Datos de Donante
  location = '';
  organization = '';

  onRegister() {
    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      ...(this.role === 'ADOPTANTE'
        ? { phone: this.phone, occupation: this.occupation }
        : { location: this.location, organization: this.organization })
    };

    console.log('Datos enviados al Backend:', payload);
  }
}
