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
  // spotsTotal: number;
  // spotsLeft: number;
  status: 'upcoming' | 'open' | 'past';
  image?: string;
}

@Component({
  selector: 'app-camps',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule],
  templateUrl: './camps.component.html',
  styleUrl: './camps.component.scss',
})
export class CampsComponent {
  camps: Camp[] = [
    {
      id: 1,
      name: 'Letni Obóz Szkoleniowy 2026',
      location: 'Wałcz',
      dateFrom: '2026-08-30',
      dateTo: '2026-09-12',
      description:
        'Intensywny 10-dniowy obóz pływacki dla zawodników. Dwa treningi dziennie, zajęcia uzupełniające na siłowni i sali treningowej, biegi przełajowe oraz zajęcia teoretyczne z zakresu treningu, regeneracji i diety.',
      // spotsTotal: 30,
      // spotsLeft: 8,
      status: 'upcoming',
    },
    {
      id: 2,
      name: 'Obóz Kondycyjny 2026',
      location: 'Hurgada Egipt',
      dateFrom: '2026-03-05',
      dateTo: '2026-03-11',
      description:
        'Wiosenny obóz przygotowywyjacy do sezonu letniego. Dwa treningi na basenie dziennie, siłowania, a do tego chwila relaksu: kąpiele w morzu, snurkowanie zjeżdalnie, gry integracyjne.',
      // spotsTotal: 25,
      // spotsLeft: 0,
      status: 'past',
      image: 'assets/ob_egipt.jpg',
    },
    {
      id: 3,
      name: 'Obóz Zimowy 2026',
      location: 'Szczyrk',
      dateFrom: '2026-02-07',
      dateTo: '2026-02-15',
      description:
        'Zimowy obóz kondycyjny połączony z integracją zawodników. Dziennie: dwa treningi na basenie, siłowania, biegi przełajowe, atrakcje integracyjne.',
      // spotsTotal: 35,
      // spotsLeft: 0,
      status: 'past',
      image: 'assets/ob_szczyrk.jpg',
    },
  ];

  get upcomingCamps() {
    return this.camps.filter((c) => c.status !== 'past');
  }
  get pastCamps() {
    return this.camps.filter((c) => c.status === 'past');
  }

  statusLabel(status: string) {
    return (
      { open: 'Otwarty', upcoming: 'Wkrótce', past: 'Zakończony' }[status] ??
      status
    );
  }

  statusSeverity(status: string): 'success' | 'warn' | 'secondary' {
    return (
      ({ open: 'success', upcoming: 'warn', past: 'secondary' }[
        status
      ] as any) ?? 'secondary'
    );
  }
}
