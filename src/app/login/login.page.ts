import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {IonButton, IonContent, IonInput, IonRouterLink} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonRouterLink
  ]
})
export class LoginPage {
  username = '';
  password = '';
  errorMessage = '';

  onLogin() {
    // Conexión con el backend :P
    console.log('Login con:', this.username, this.password);
  }
}
