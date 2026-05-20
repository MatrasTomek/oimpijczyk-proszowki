import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1 class="admin-page-title">Dashboard</h1>
    <p class="admin-page-sub">Witaj w panelu administratora Olimpijczyk Proszówki</p>

    <div class="dashboard-grid">
      <a routerLink="/admin/news" class="dash-card">
        <i class="pi pi-file-edit"></i>
        <span class="dash-label">Aktualności</span>
        <span class="dash-hint">Zarządzaj postami</span>
      </a>
      <a routerLink="/admin/gallery" class="dash-card">
        <i class="pi pi-images"></i>
        <span class="dash-label">Galeria</span>
        <span class="dash-hint">Upload zdjęć</span>
      </a>
      <a routerLink="/admin/camps" class="dash-card">
        <i class="pi pi-calendar"></i>
        <span class="dash-label">Obozy</span>
        <span class="dash-hint">Zarządzaj obozami</span>
      </a>
      <a routerLink="/admin/results" class="dash-card">
        <i class="pi pi-chart-bar"></i>
        <span class="dash-label">Wyniki</span>
        <span class="dash-hint">Wyniki zawodów</span>
      </a>
      <a routerLink="/admin/presence" class="dash-card">
        <i class="pi pi-id-card"></i>
        <span class="dash-label">Sekcja obecności</span>
        <span class="dash-hint">Karty na stronie głównej</span>
      </a>
      <a routerLink="/admin/trainings" class="dash-card">
        <i class="pi pi-clock"></i>
        <span class="dash-label">Treningi</span>
        <span class="dash-hint">Harmonogram i grupy</span>
      </a>
    </div>
  `,
  styles: [`
    .admin-page-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #F5A623; text-transform: uppercase; margin-bottom: 0.25rem; }
    .admin-page-sub { color: #aaa; margin-bottom: 2.5rem; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .dash-card {
      background: #111; border: 1px solid #2a2a2a; border-radius: 12px;
      padding: 2rem; display: flex; flex-direction: column; align-items: center;
      gap: 0.75rem; text-align: center; transition: border-color 0.2s, transform 0.2s;
      i { font-size: 2.5rem; color: #F5A623; }
      &:hover { border-color: #F5A623; transform: translateY(-2px); }
    }
    .dash-label { font-family: 'Oswald', sans-serif; font-size: 1.2rem; color: #fff; text-transform: uppercase; }
    .dash-hint { color: #aaa; font-size: 0.85rem; }
  `]
})
export class DashboardComponent {}
