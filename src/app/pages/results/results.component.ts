import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  AthletesService,
  BestResult,
} from '../../core/services/athletes.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  private athletesService = inject(AthletesService);

  bestResults: BestResult[] = [];

  ngOnInit() {
    this.athletesService.getBestResultsFromLastCompetition().subscribe({
      next: (data) => {
        this.bestResults = data;
      },
      error: () => {},
    });
  }
}
