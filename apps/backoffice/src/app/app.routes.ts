import { Route } from '@angular/router';
import { authGuard, adminGuard } from '@falling-water/share';

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
        path: 'categories',
        loadComponent: () =>
          import('./categories/category-list').then((m) => m.CategoryList),
        title: 'Backoffice - Categories',
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./categories/category-form').then((m) => m.CategoryForm),
        title: 'Backoffice - New Category',
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import('./categories/category-form').then((m) => m.CategoryForm),
        title: 'Backoffice - Edit Category',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/product-list').then((m) => m.ProductList),
        title: 'Backoffice - Products',
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./products/product-form').then((m) => m.ProductForm),
        title: 'Backoffice - New Product',
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./products/product-detail').then((m) => m.ProductDetail),
        title: 'Backoffice - Product Details',
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./products/product-form').then((m) => m.ProductForm),
        title: 'Backoffice - Edit Product',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/order-list').then((m) => m.OrderList),
        title: 'Backoffice - Orders',
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./orders/order-detail').then((m) => m.OrderDetail),
        title: 'Backoffice - Order Details',
      },
      {
        path: 'systems',
        loadComponent: () =>
          import('./systems/system-list').then((m) => m.SystemList),
        title: 'Backoffice - Systems',
      },
      {
        path: 'systems/new',
        loadComponent: () =>
          import('./systems/system-form').then((m) => m.SystemForm),
        title: 'Backoffice - New System',
      },
      {
        path: 'systems/:id/edit',
        loadComponent: () =>
          import('./systems/system-form').then((m) => m.SystemForm),
        title: 'Backoffice - Edit System',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
