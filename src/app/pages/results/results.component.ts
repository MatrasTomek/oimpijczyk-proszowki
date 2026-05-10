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
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  results: Result[] = [
    { athlete: 'Karolina Malinowska', competition: 'Mistrzostwa Małopolski 2025', discipline: '100m dowolny', result: '1:02.34', place: 1, date: '2025-04-15' },
    { athlete: 'Tomasz Wójcik', competition: 'Mistrzostwa Małopolski 2025', discipline: '200m grzbietowy', result: '2:18.45', place: 2, date: '2025-04-15' },
    { athlete: 'Marta Kowalczyk', competition: 'Mistrzostwa Małopolski 2025', discipline: '100m motylkowy', result: '1:08.12', place: 1, date: '2025-04-15' },
    { athlete: 'Piotr Nowak', competition: 'Puchar Polski 2025', discipline: '400m zmiennym', result: '4:55.67', place: 3, date: '2025-03-10' },
    { athlete: 'Anna Zielińska', competition: 'Puchar Polski 2025', discipline: '50m dowolny', result: '27.89', place: 2, date: '2025-03-10' },
    { athlete: 'Kamil Dąbrowski', competition: 'Zawody Regionalne 2025', discipline: '200m dowolny', result: '2:05.33', place: 1, date: '2025-02-22' },
  ];

  medalColor(place: number): 'warn' | 'secondary' | 'info' {
    if (place === 1) return 'warn';
    if (place === 2) return 'secondary';
    return 'info';
  }

  medalLabel(place: number): string {
    return place === 1 ? '🥇 1. miejsce' : place === 2 ? '🥈 2. miejsce' : `🥉 ${place}. miejsce`;
  }
}
