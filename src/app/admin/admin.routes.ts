import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'news', loadComponent: () => import('./news/news-list.component').then(m => m.NewsListComponent) },
      { path: 'gallery', loadComponent: () => import('./gallery/gallery-list.component').then(m => m.GalleryListComponent) },
      { path: 'camps', loadComponent: () => import('./camps/camps-list.component').then(m => m.CampsListComponent) },
      { path: 'results', loadComponent: () => import('./results/results-list.component').then(m => m.ResultsListComponent) },
      { path: 'presence', loadComponent: () => import('./presence/presence-list.component').then(m => m.PresenceListComponent) },
      { path: 'trainings', loadComponent: () => import('./trainings/trainings-list.component').then(m => m.TrainingsListComponent) },
    ]
  },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
];
