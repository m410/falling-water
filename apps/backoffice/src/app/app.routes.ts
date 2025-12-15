import { Route } from '@angular/router';
import { authGuard, adminGuard } from '@falling-water/shared/auth';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    title: 'Backoffice - Login',
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard').then((m) => m.Dashboard),
        pathMatch: 'full',
        title: 'Backoffice - Dashboard',
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users').then((m) => m.Users),
        title: 'Backoffice - Users',
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/orders').then((m) => m.Orders),
        title: 'Backoffice - Orders',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
