import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <img src="assets/logo.jpg" alt="Olimpijczyk" class="login-logo" />
        <h1 class="login-title">Panel administratora</h1>
        <p class="login-subtitle">Olimpijczyk Proszówki</p>

        <p-message *ngIf="error()" severity="error" [text]="error()!" styleClass="w-full" />

        <div class="login-form">
          <div class="field">
            <label for="username">Login</label>
            <input pInputText id="username" [(ngModel)]="username" placeholder="Login administratora" class="w-full" />
          </div>
          <div class="field">
            <label for="password">Hasło</label>
            <p-password id="password" [(ngModel)]="password" [feedback]="false" [toggleMask]="true" inputStyleClass="w-full" styleClass="w-full" />
          </div>
          <button pButton label="Zaloguj się" class="p-button w-full" (click)="login()" [loading]="loading()"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .login-card {
      background: #111;
      border: 1px solid #2a2a2a;
      border-top: 3px solid #F5A623;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    .login-logo { height: 80px; margin-bottom: 1.25rem; }
    .login-title { font-family: 'Oswald', sans-serif; color: #F5A623; font-size: 1.4rem; text-transform: uppercase; margin-bottom: 0.25rem; }
    .login-subtitle { color: #aaa; font-size: 0.85rem; margin-bottom: 2rem; }
    .login-form { text-align: left; }
    .field { margin-bottom: 1.25rem; }
    .field label { display: block; color: #ccc; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .w-full { width: 100%; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private router: Router) {}

  async login() {
    if (!this.username || !this.password) {
      this.error.set('Wprowadź login i hasło');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    // TODO: replace with real API call
    await new Promise(r => setTimeout(r, 800));
    if (this.username === 'admin' && this.password === 'admin123') {
      localStorage.setItem('admin_token', 'demo-token');
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error.set('Nieprawidłowy login lub hasło');
    }
    this.loading.set(false);
  }
}
