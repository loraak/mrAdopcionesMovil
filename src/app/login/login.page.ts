import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonRouterLink, ToastController } from '@ionic/angular';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, IonInput, IonButton, IonRouterLink]
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);

  // Límites de longitud: deben coincidir con LoginRequest en el backend
  readonly maxUsuario = 100;
  readonly maxPassword = 72;

  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  onLogin() {
    if (this.loading) return;
    this.errorMessage = '';

    const usuario = this.username.trim();

    // 1) Ambos campos deben tener información
    if (!usuario || !this.password) {
      this.errorMessage = 'Ingresa tu usuario y contraseña.';
      return;
    }

    // 2) Rechazar entradas demasiado largas (el atributo maxlength lo evita al escribir,
    //    pero un texto pegado o una petición manual podrían saltárselo)
    if (usuario.length > this.maxUsuario || this.password.length > this.maxPassword) {
      this.errorMessage = 'Los datos ingresados no son válidos.';
      return;
    }

    this.loading = true;

    // Nunca se escribe el usuario ni la contraseña en consola (Capacitor los enviaría a Logcat)
    this.authService.login({ username: usuario, contrasena: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.password = '';
        this.router.navigateByUrl(this.destino());
        this.mostrarMensaje(`¡Bienvenido, ${res.user.username}!`, 'success');
      },
      error: (err) => {
        this.loading = false;
        this.password = ''; // se borra la contraseña tras un intento fallido
        this.errorMessage = this.mensajeSeguro(err.status);
      }
    });
  }

  // Mensajes fijos según el tipo de fallo: nunca se muestra el texto que mande el servidor,
  // así no se filtran detalles técnicos ni se distingue "usuario inexistente" de "contraseña mala".
  private mensajeSeguro(status: number): string {
    if (status === 0) return 'No se pudo conectar con el servidor. Revisa tu conexión.';
    if (status === 400 || status === 401) return 'Usuario o contraseña incorrectos.';
    if (status >= 500) return 'Ocurrió un error. Intenta de nuevo más tarde.';
    return 'No fue posible iniciar sesión.';
  }

  // Vuelve a la página que quería visitar; solo acepta rutas internas
  private destino(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/app/home';
  }

  private async mostrarMensaje(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, color, duration: 2500, position: 'top' });
    await toast.present();
  }
}
