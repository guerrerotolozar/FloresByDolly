import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
  },
  {
    path: 'galeria',
    loadComponent: () => import('./pages/galeria/galeria').then((m) => m.Galeria),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
