import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ResultsService, Result } from '../../core/services/results.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  private resultsService = inject(ResultsService);

  results: Array<Result & { result: string; date: string }> = [];

  ngOnInit() {
    this.resultsService.getAll().subscribe({
      next: (data) => {
        this.results = data.map((r) => ({
          ...r,
          result: r.result_time,
          date: r.competition_date,
        }));
      },
      error: () => {},
    });
  }

  medalColor(place: number): 'warn' | 'secondary' | 'info' {
    if (place === 1) return 'warn';
    if (place === 2) return 'secondary';
    return 'info';
  }

  medalLabel(place: number): string {
    return place === 1
      ? '🥇 1. miejsce'
      : place === 2
        ? '🥈 2. miejsce'
        : `🥉 ${place}. miejsce`;
  }
}
