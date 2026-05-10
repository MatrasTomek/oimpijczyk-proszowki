import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface TrainingGroup {
  name: string;
  ageRange: string;
  level: string;
  schedule: { day: string; time: string; pool: string }[];
}

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss'
})
export class TrainingsComponent {
  groups: TrainingGroup[] = [
    {
      name: 'Grupa Żaki',
      ageRange: '6–9 lat',
      level: 'Początkujący',
      schedule: [
        { day: 'Poniedziałek', time: '16:00–17:00', pool: 'Basen 25m' },
        { day: 'Środa', time: '16:00–17:00', pool: 'Basen 25m' },
        { day: 'Piątek', time: '16:30–17:30', pool: 'Basen 25m' },
      ]
    },
    {
      name: 'Grupa Młodzik',
      ageRange: '10–12 lat',
      level: 'Średniozaawansowany',
      schedule: [
        { day: 'Poniedziałek', time: '17:00–18:30', pool: 'Basen 50m' },
        { day: 'Wtorek', time: '17:00–18:30', pool: 'Basen 50m' },
        { day: 'Czwartek', time: '17:00–18:30', pool: 'Basen 50m' },
        { day: 'Sobota', time: '9:00–10:30', pool: 'Basen 50m' },
      ]
    },
    {
      name: 'Grupa Juniorsza',
      ageRange: '13–15 lat',
      level: 'Zaawansowany',
      schedule: [
        { day: 'Poniedziałek', time: '6:00–7:30', pool: 'Basen 50m' },
        { day: 'Wtorek', time: '17:30–19:30', pool: 'Basen 50m' },
        { day: 'Środa', time: '6:00–7:30', pool: 'Basen 50m' },
        { day: 'Czwartek', time: '17:30–19:30', pool: 'Basen 50m' },
        { day: 'Piątek', time: '6:00–7:30', pool: 'Basen 50m' },
      ]
    },
    {
      name: 'Grupa Senior',
      ageRange: '16+ lat',
      level: 'Wyczynowy',
      schedule: [
        { day: 'Poniedziałek', time: '6:00–8:00', pool: 'Basen 50m' },
        { day: 'Wtorek', time: '6:00–8:00', pool: 'Basen 50m' },
        { day: 'Środa', time: '17:00–19:30', pool: 'Basen 50m' },
        { day: 'Czwartek', time: '6:00–8:00', pool: 'Basen 50m' },
        { day: 'Piątek', time: '6:00–8:00', pool: 'Basen 50m' },
        { day: 'Sobota', time: '8:00–10:00', pool: 'Basen 50m' },
      ]
    },
  ];

  levelSeverity(level: string): 'success' | 'warn' | 'danger' | 'info' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      'Początkujący': 'success',
      'Średniozaawansowany': 'info',
      'Zaawansowany': 'warn',
      'Wyczynowy': 'danger',
    };
    return map[level] ?? 'info';
  }
}
