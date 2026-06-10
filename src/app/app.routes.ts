import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'o-nas', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'treningi', loadComponent: () => import('./pages/trainings/trainings.component').then(m => m.TrainingsComponent) },
  { path: 'obozy', loadComponent: () => import('./pages/camps/camps.component').then(m => m.CampsComponent) },
  { path: 'wyniki', loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent) },
  { path: 'galeria', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent) },
  { path: 'aktualnosci/:id', loadComponent: () => import('./pages/news-detail/news-detail.component').then(m => m.NewsDetailComponent) },
  { path: 'rodo', loadComponent: () => import('./pages/rodo/rodo.component').then(m => m.RodoComponent) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', redirectTo: '' }
];
