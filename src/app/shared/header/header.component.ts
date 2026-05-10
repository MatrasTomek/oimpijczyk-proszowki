import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, DrawerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  menuOpen = signal(false);
  scrolled = signal(false);

  navItems: NavItem[] = [
    { label: 'Start', path: '/' },
    { label: 'O nas', path: '/o-nas' },
    { label: 'Treningi', path: '/treningi' },
    { label: 'Obozy szkoleniowe', path: '/obozy' },
    { label: 'Wyniki zawodników', path: '/wyniki' },
    { label: 'Galeria', path: '/galeria' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
