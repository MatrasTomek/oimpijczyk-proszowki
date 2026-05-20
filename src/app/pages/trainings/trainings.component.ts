import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TrainingsService } from '../../core/services/trainings.service';

interface ScheduleRow {
  day: string;
  timeW?: string;
  workout?: string;
  time: string;
  pool: string;
  place: string;
  poolSummer?: string;
  placeSummer?: string;
}

interface TrainingGroupDisplay {
  name: string;
  ageRange: string;
  level?: string;
  schedule: ScheduleRow[];
}

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
})
export class TrainingsComponent implements OnInit {
  private trainingsService = inject(TrainingsService);

  groups: TrainingGroupDisplay[] = [];

  ngOnInit() {
    this.trainingsService.getGroups().subscribe({
      next: (data) => {
        this.groups = data.map(g => ({
          name: g.name,
          ageRange: g.age_range,
          level: g.level ?? undefined,
          schedule: g.sessions.map(s => ({
            day: s.day_of_week,
            time: s.time_start,
            timeW: s.time_morning ?? undefined,
            workout: s.workout_type ?? undefined,
            pool: s.pool ?? '',
            place: s.location ?? '',
            poolSummer: s.pool_summer ?? undefined,
            placeSummer: s.location_summer ?? undefined,
          })),
        }));
      },
      error: () => {},
    });
  }

  levelSeverity(level: string): 'success' | 'warn' | 'info' | 'secondary' {
    if (level?.toLowerCase().includes('zaawan')) return 'warn';
    if (level?.toLowerCase().includes('senior')) return 'success';
    return 'info';
  }
}
