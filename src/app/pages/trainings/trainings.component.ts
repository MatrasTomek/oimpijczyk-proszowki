import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface TrainingGroup {
  name: string;
  ageRange: string;
  level?: string;
  schedule: {
    day: string;
    timeW?: string;
    workout?: string;
    time: string;
    pool: string;
    place: string;
    poolSummer?: string;
    placeSummer?: string;
  }[];
}

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
})
export class TrainingsComponent {
  groups: TrainingGroup[] = [
    {
      name: 'Dzieci',
      ageRange: '6–9 lat',

      schedule: [
        {
          day: 'Poniedziałek',
          time: '15:00–16:30',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Środa',
          time: '15:00–16:30',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Piątek',
          time: '15:00–16:30',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
      ],
    },
    {
      name: 'Dzieci starsze',
      ageRange: '10-11 lat',
      schedule: [
        {
          day: 'Poniedziałek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Wtorek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Środa',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Czwartek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Piątek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Sobota',
          time: '11:00–12:30',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
      ],
    },
    {
      name: 'Młodzik',
      ageRange: '12–13 lat',
      schedule: [
        {
          day: 'Poniedziałek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki / okres zimowy',
          poolSummer: 'Basen 50m',
          placeSummer: 'Dębica / okres letni',
        },
        {
          day: 'Wtorek',
          timeW: '6:15–7:15',
          workout: 'Siłownia',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Środa',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Czwartek',
          timeW: '6:15–7:15',
          workout: 'Siłownia',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Piątek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Sobota',
          time: '11:00–12:30',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
      ],
    },
    {
      name: 'Junior Młodszy',
      ageRange: '14–15 lat',
      schedule: [
        {
          day: 'Poniedziałek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki / okres zimowy',
          poolSummer: 'Basen 50m',
          placeSummer: 'Dębica / okres letni',
        },
        {
          day: 'Wtorek',
          timeW: '6:15–7:15',
          workout: 'Siłownia',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Środa',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Czwartek',
          timeW: '6:15–7:15',
          workout: 'Siłownia',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Piątek',
          time: '15:00–17:00',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
        {
          day: 'Sobota',
          time: '11:00–12:30',
          pool: 'Basen 25m',
          place: 'Proszówki',
        },
      ],
    },
  ];

  levelSeverity(level: string): 'success' | 'warn' | 'danger' | 'info' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      Początkujący: 'success',
      Średniozaawansowany: 'info',
      Zaawansowany: 'warn',
      Wyczynowy: 'danger',
    };
    return map[level] ?? 'info';
  }
}
