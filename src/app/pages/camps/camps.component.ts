import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

interface Camp {
  id: number;
  name: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  description: string;
  spotsTotal: number;
  spotsLeft: number;
  status: 'upcoming' | 'open' | 'past';
  image?: string;
}

@Component({
  selector: 'app-camps',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule],
  templateUrl: './camps.component.html',
  styleUrl: './camps.component.scss'
})
export class CampsComponent {
  camps: Camp[] = [
    {
      id: 1,
      name: 'Letni Obóz Szkoleniowy 2025',
      location: 'Krynica-Zdrój',
      dateFrom: '2025-07-07',
      dateTo: '2025-07-21',
      description: 'Intensywny 14-dniowy obóz pływacki dla zawodników grup Juniorsza i Senior. Dwa treningi dziennie, zajęcia uzupełniające i atrakcje terenowe.',
      spotsTotal: 30,
      spotsLeft: 8,
      status: 'open'
    },
    {
      id: 2,
      name: 'Obóz Zimowy 2025',
      location: 'Zakopane',
      dateFrom: '2025-02-17',
      dateTo: '2025-02-28',
      description: 'Zimowy obóz łączący trening pływacki z aktywnością narciarską. Dla grup Młodzik i Juniorsza.',
      spotsTotal: 25,
      spotsLeft: 0,
      status: 'past'
    },
    {
      id: 3,
      name: 'Obóz Letni 2024',
      location: 'Mielno',
      dateFrom: '2024-07-08',
      dateTo: '2024-07-22',
      description: 'Letni obóz nad morzem z intensywnym programem treningowym.',
      spotsTotal: 35,
      spotsLeft: 0,
      status: 'past'
    }
  ];

  get upcomingCamps() { return this.camps.filter(c => c.status !== 'past'); }
  get pastCamps() { return this.camps.filter(c => c.status === 'past'); }

  statusLabel(status: string) {
    return { open: 'Zapisy otwarte', upcoming: 'Wkrótce', past: 'Zakończony' }[status] ?? status;
  }

  statusSeverity(status: string): 'success' | 'warn' | 'secondary' {
    return { open: 'success', upcoming: 'warn', past: 'secondary' }[status] as any ?? 'secondary';
  }
}
