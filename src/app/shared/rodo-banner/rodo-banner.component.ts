import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rodo-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rodo-banner.component.html',
  styleUrl: './rodo-banner.component.scss',
})
export class RodoBannerComponent implements OnInit {
  visible = signal(false);

  private readonly STORAGE_KEY = 'rodo_dismissed';
  private readonly MONTH_MS = 30 * 24 * 60 * 60 * 1000;

  ngOnInit() {
    const dismissed = localStorage.getItem(this.STORAGE_KEY);
    if (!dismissed || Date.now() - parseInt(dismissed, 10) > this.MONTH_MS) {
      this.visible.set(true);
    }
  }

  dismiss() {
    localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
    this.visible.set(false);
  }
}
