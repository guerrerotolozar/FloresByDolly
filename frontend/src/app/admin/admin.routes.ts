import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./admin-login/admin-login').then((m) => m.AdminLogin),
  },
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'productos',
        loadComponent: () => import('./admin-products/admin-products').then((m) => m.AdminProducts),
      },
      {
        path: 'productos/nuevo',
        loadComponent: () =>
          import('./admin-product-form/admin-product-form').then((m) => m.AdminProductForm),
      },
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./admin-product-form/admin-product-form').then((m) => m.AdminProductForm),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./admin-categories/admin-categories').then((m) => m.AdminCategories),
      },
      {
        path: 'galeria',
        loadComponent: () => import('./admin-gallery/admin-gallery').then((m) => m.AdminGallery),
      },
    ],
  },
];
