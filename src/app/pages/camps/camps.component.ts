import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CampsService, Camp } from '../../core/services/camps.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-camps',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule],
  templateUrl: './camps.component.html',
  styleUrl: './camps.component.scss',
})
export class CampsComponent implements OnInit {
  private campsService = inject(CampsService);

  camps: Array<Camp & { dateFrom: string; dateTo: string; image: string | null }> = [];

  ngOnInit() {
    this.campsService.getAll().subscribe({
      next: (data) => {
        this.camps = data.map(c => ({
          ...c,
          dateFrom: c.date_from,
          dateTo: c.date_to,
          image: c.image_path ? `${environment.apiUrl}/${c.image_path}` : null,
        }));
      },
      error: () => {},
    });
  }

  get upcomingCamps() {
    return this.camps.filter((c) => c.status !== 'past');
  }
  get pastCamps() {
    return this.camps.filter((c) => c.status === 'past');
  }

  statusLabel(status: string) {
    return ({ open: 'Otwarty', upcoming: 'Wkrótce', past: 'Zakończony' }[status] ?? status);
  }

  statusSeverity(status: string): 'success' | 'warn' | 'secondary' {
    return (({ open: 'success', upcoming: 'warn', past: 'secondary' }[status] as any) ?? 'secondary');
  }
}
