import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();

  navLinks = [
    { label: 'Start', path: '/' },
    { label: 'O nas', path: '/o-nas' },
    { label: 'Treningi', path: '/treningi' },
    { label: 'Obozy szkoleniowe', path: '/obozy' },
    { label: 'Wyniki zawodników', path: '/wyniki' },
    { label: 'Galeria', path: '/galeria' },
  ];
}
