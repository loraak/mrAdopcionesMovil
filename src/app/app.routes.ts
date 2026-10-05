import { Routes } from '@angular/router';
import {rolGuard} from "./services/rol.guard";
import {authGuard} from "./services/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: 'app/home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'app',
    loadComponent: () => import('./home/layout/layout.page').then(m => m.MainLayoutPage),
    children: [
      // Públicas
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./catalogo/catalogo.page').then(m => m.CatalogoPage)
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./nosotros/nosotros.page').then(m => m.NosotrosPage)
      },

      // Cualquier usuario con sesión
      {
        path: 'perfil',
        canActivate: [authGuard],
        loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage)
      },
      {
        path: 'solicitud-adopcion',
        canActivate: [rolGuard('DONANTE')],
        loadComponent: () => import('./solicitud-adopcion/solicitud-adopcion.page').then(m => m.SolicitudAdopcionPage)
      },

      {
        path: 'mascota',
        canActivate: [rolGuard('DONANTE')],
        loadComponent: () => import('./mascota/mascota.page').then(m => m.MascotaPage)
      }
    ]
  }
];
