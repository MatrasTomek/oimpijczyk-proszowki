import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-logo">
          <img src="assets/logo.jpg" alt="Logo" style="height:48px" />
          <span>Admin</span>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-home"></i> Dashboard
          </a>
          <a routerLink="/admin/news" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-file-edit"></i> Aktualności
          </a>
          <a routerLink="/admin/gallery" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-images"></i> Galeria
          </a>
          <a routerLink="/admin/camps" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-calendar"></i> Obozy
          </a>
          <a routerLink="/admin/results" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-chart-bar"></i> Wyniki
          </a>
          <a routerLink="/admin/presence" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-id-card"></i> Sekcja obecności
          </a>
          <a routerLink="/admin/trainings" routerLinkActive="active" class="sidebar-link">
            <i class="pi pi-clock"></i> Treningi
          </a>
        </nav>
        <div class="sidebar-footer">
          <a routerLink="/" class="sidebar-link"><i class="pi pi-globe"></i> Przejdź do strony</a>
          <button pButton label="Wyloguj" icon="pi pi-sign-out" class="p-button-outlined p-button-sm" (click)="logout()"></button>
        </div>
      </aside>
      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: 100vh; }
    .admin-sidebar {
      width: 240px;
      background: #111;
      border-right: 1px solid #2a2a2a;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: fixed;
      top: 0; left: 0; bottom: 0;
    }
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #2a2a2a;
      span { color: #F5A623; font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; }
    }
    .sidebar-nav { flex: 1; padding: 1rem 0; }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #aaa;
      font-size: 0.9rem;
      transition: all 0.2s;
      i { color: #F5A623; width: 16px; }
      &:hover, &.active { color: #fff; background: rgba(245,166,35,0.1); border-left: 3px solid #F5A623; padding-left: calc(1.5rem - 3px); }
    }
    .sidebar-footer { padding: 1rem 1.5rem; border-top: 1px solid #2a2a2a; display: flex; flex-direction: column; gap: 0.75rem; }
    .admin-main { flex: 1; margin-left: 240px; padding: 2rem; background: #000; min-height: 100vh; }
  `]
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('admin_token');
    this.router.navigate(['/admin/login']);
  }
}
