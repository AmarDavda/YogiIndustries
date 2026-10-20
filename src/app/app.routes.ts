import { Routes } from '@angular/router';

/** `data.titleKey` = translation key used for the browser tab title ({id} is replaced by the route id). */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'about', data: { titleKey: 'nav.about' }, loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: 'category/:id', data: { titleKey: 'cat.{id}.name' }, loadComponent: () => import('./pages/category/category').then((m) => m.Category) },
  { path: 'product/:id', data: { titleKey: 'p{id}.name' }, loadComponent: () => import('./pages/product/product').then((m) => m.ProductPage) },
  { path: 'contact', data: { titleKey: 'nav.contact' }, loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: 'cart', data: { titleKey: 'nav.cart' }, loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart) },
  { path: 'faq', data: { titleKey: 'nav.faq' }, loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq) },
  { path: 'policy', data: { titleKey: 'nav.policy' }, loadComponent: () => import('./pages/policy/policy').then((m) => m.Policy) },
  { path: '**', data: { titleKey: 'nf.title' }, loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];
