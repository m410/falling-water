import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./home2/home').then((m) => m.Home),
        pathMatch: 'full',
        data: { wideMain: true },
      },
      {
        path: 'dictionary',
        loadComponent: () =>
          import('./learn/dictionary').then((m) => m.Dictionary),
      },
      {
        path: 'store',
        loadComponent: () => import('./store/store').then((m) => m.Store),
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact').then((m) => m.Contact),
      },
      {
        path: 'cart',
        loadComponent: () => import('./cart/cart').then((m) => m.Cart),
      },
      {
        path: 'flow-rate',
        loadComponent: () => import('./flow-rate/flow-rate').then((m) => m.FlowRate),
      },
    ],
  },
      {
        path: 'home3',
        loadComponent: () => import('./home3/home').then((m) => m.Home),
        data: { wideMain: true },
      },
];
