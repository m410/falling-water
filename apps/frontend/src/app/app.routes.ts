import { Route } from '@angular/router';
import { authGuard } from '@falling-water/share';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home').then((m) => m.Home),
        pathMatch: 'full',
        data: { wideMain: true },
        title: 'Falling Water - Home',
      },
      {
        path: 'hydro-system',
        loadComponent: () =>
          import('./hydro-system/hydro-system').then((m) => m.HydroSystem),
        title: 'Falling Water - Hydro System Design',
      },
      {
        path: 'store',
        loadComponent: () => import('./store/store').then((m) => m.Store),
        title: 'Falling Water - Store',
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact').then((m) => m.Contact),
        title: 'Falling Water - Contact',
      },
      {
        path: 'cart',
        loadComponent: () => import('./store/cart/cart').then((m) => m.Cart),
        title: 'Falling Water - Shopping Cart',
        canActivate: [authGuard],
      },
      {
        path: 'flow-rate',
        loadComponent: () => import('./hydro-system/flow-rate/flow-rate').then((m) => m.FlowRate),
        title: 'Falling Water - Flow Rate Calculator',
      },
      {
        path: 'account',
        loadComponent: () => import('./account/account').then((m) => m.Account),
        title: 'Falling Water - My Account',
        canActivate: [authGuard],
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login').then((m) => m.Login),
        title: 'Falling Water - Login',
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register').then((m) => m.Register),
        title: 'Falling Water - Register',
      },
    ],
  }
];
