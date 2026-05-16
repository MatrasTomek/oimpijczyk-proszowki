import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface Result {
  athlete: string;
  competition: string;
  discipline: string;
  result: string;
  place: number;
  date: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  results: Result[] = [
    {
      athlete: 'Amelia Wąs',
      competition: 'Arena Grand Prix Oświęcim 2026',
      discipline: '50m klasyczny',
      result: '36.25',
      place: 1,
      date: '2026-05-10',
    },
    {
      athlete: 'Amelia Wąs',
      competition: 'Arena Grand Prix Oświęcim 2026',
      discipline: '100m klasyczny',
      result: '1:17.31',
      place: 1,
      date: '2026-05-09',
    },
    {
      athlete: 'Amelia Wąs',
      competition: 'Arena Grand Prix Oświęcim 2026',
      discipline: '200m klasyczny',
      result: '2:48.38',
      place: 1,
      date: '2026-05-09',
    },
    {
      athlete: 'Hanna Jurek',
      competition: 'Arena Grand Prix Oświęcim 2026',
      discipline: '100m grzbietowy',
      result: '1:18.27',
      place: 3,
      date: '2026-05-09',
    },
    {
      athlete: 'Amelia Wąs',
      competition: 'Feniks Pool Party Dębica 2026',
      discipline: '200m zmienny',
      result: '2:30.33',
      place: 1,
      date: '2026-03-29',
    },
    {
      athlete: 'Amelia Wąs',
      competition: 'Feniks Pool Party Dębica 2026',
      discipline: '100m klasyczny',
      result: '1:15.77',
      place: 1,
      date: '2026-03-29',
    },
    {
      athlete: 'Maks Wąs',
      competition: 'Feniks Pool Party Dębica 2026',
      discipline: '200m grzbietowy',
      result: '3:10.67',
      place: 2,
      date: '2026-03-29',
    },
  ];

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
