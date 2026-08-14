import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
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
    { label: 'Sekcja B - zapisy', path: '/sekcjab' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
