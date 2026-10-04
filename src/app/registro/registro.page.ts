import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonRouterLink,
  IonSegment,
  IonSegmentButton,
  IonLabel, ToastController
} from '@ionic/angular';
import {AuthService, RegistroRequest, Rol} from "../services/auth.service";

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
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController)
  // Rol seleccionado por defecto
  rol: Rol = 'ADOPTANTE';

  username = '';
  correo = '';
  contrasena = '';

  telefono = '';
  ocupacion = '';

  locacion = '';
  organizacion = '';

  loading = false;

  onRegister() {
    if (this.loading) return;

    const payload: RegistroRequest = {
      username: this.username,
      correo: this.correo,
      contrasena: this.contrasena,
      rol: this.rol,
      ...(this.rol === 'ADOPTANTE'
          ? { telefono: this.telefono, ocupacion: this.ocupacion }
          : { locacion: this.locacion, organizacion: this.organizacion })
    };

    this.loading = true;
    this.authService.registrar(payload).subscribe({
      next: async() => {
        this.loading = false;
        await this.showToast('Cuenta creada :3 Ahora inicia sesión', 'success');
        this.router.navigateByUrl('/login');
      },
      error: async(err) => {
        this.loading = false;
        const msg = err.status === 0
          ? 'No se pudo conectar con el servidor'
          : err.error?.message ?? 'Ocurrió un error...';
        await this.showToast(msg, 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({message, color, duration: 3000, position: 'top'});
    await toast.present();
  }
}

