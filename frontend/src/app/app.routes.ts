import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rutas específicas primero
  {
    path: 'home',
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
    path: 'rifa',
    loadComponent: () => import('./pages/rifa/rifa').then((m) => m.Rifa),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  // Redirecciones al final por seguridad (como indicó el profe)
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '404', 
    pathMatch: 'full' 
  }
];
