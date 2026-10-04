import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {IonButton, IonContent, IonInput, IonRouterLink} from '@ionic/angular';
import {AuthService} from "../services/auth.service";

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
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  contrasena = '';
  errorMessage = '';
  loading = false;

  onLogin() {
    if (this.loading) return;

    this.errorMessage = '';
    this.loading = true;

    this.authService.login({username: this.username.trim(), contrasena: this.contrasena}).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.destino());
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.status === 0 ? 'No se pudo conectar' : err.error?.message ?? 'Ocurrión un error al iniciar sesión';
      }
    });
  }

  private destino(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') && !url.startsWith('//') ? url: '/app/home';
  }
}
