import { Routes } from '@angular/router';

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
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./catalogo/catalogo.page').then(m => m.CatalogoPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import ('./perfil/perfil.page').then(m => m.PerfilPage)
      },
      {
        path: 'nosotros',
        loadComponent: () => import ('./nosotros/nosotros.page').then(m => m.NosotrosPage)
      },
      {
        path: 'mascota',
        loadComponent: () => import ('./mascota/mascota.page').then(m => m.MascotaPage)
      }
    ]
  }
];
