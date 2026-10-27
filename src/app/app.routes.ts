import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Olimpijczyk Proszówki – Klub Pływacki', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'o-nas', title: 'O nas | Olimpijczyk Proszówki', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'treningi', title: 'Treningi | Olimpijczyk Proszówki', loadComponent: () => import('./pages/trainings/trainings.component').then(m => m.TrainingsComponent) },
  { path: 'obozy', title: 'Obozy | Olimpijczyk Proszówki', loadComponent: () => import('./pages/camps/camps.component').then(m => m.CampsComponent) },
  { path: 'wyniki', title: 'Wyniki | Olimpijczyk Proszówki', loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent) },
  { path: 'galeria', title: 'Galeria | Olimpijczyk Proszówki', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent) },
  { path: 'aktualnosci/:id', loadComponent: () => import('./pages/news-detail/news-detail.component').then(m => m.NewsDetailComponent) },
  { path: 'rodo', title: 'RODO | Olimpijczyk Proszówki', loadComponent: () => import('./pages/rodo/rodo.component').then(m => m.RodoComponent) },
  { path: 'sekcjab', title: 'Sekcja B – zapisy | Olimpijczyk Proszówki', loadComponent: () => import('./pages/sekcjab/sekcjab.component').then(m => m.SekcjaBComponent) },
  { path: 'admin', title: 'Panel administracyjny', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', redirectTo: '' }
];
