import { Route } from '@angular/router';

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
      },
      {
        path: 'flow-rate',
        loadComponent: () => import('./hydro-system/flow-rate/flow-rate').then((m) => m.FlowRate),
        title: 'Falling Water - Flow Rate Calculator',
      },
    ],
  }
];
