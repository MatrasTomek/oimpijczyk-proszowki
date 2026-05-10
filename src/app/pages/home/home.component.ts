import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, TagModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  stats = [
    { value: '15+', label: 'Lat istnienia' },
    { value: '80+', label: 'Zawodników' },
    { value: '200+', label: 'Medali' },
    { value: '12', label: 'Trenerów' },
  ];

  latestNews: NewsItem[] = [
    {
      id: 1,
      title: 'Sukces na Mistrzostwach Małopolski',
      excerpt: 'Nasi zawodnicy zdobyli 5 złotych medali na tegorocznych Mistrzostwach Małopolski w Pływaniu.',
      date: '2025-04-20',
      category: 'Wyniki'
    },
    {
      id: 2,
      title: 'Letni Obóz Szkoleniowy 2025',
      excerpt: 'Zapisy na letni obóz szkoleniowy już otwarte! Zapraszamy zawodników wszystkich grup wiekowych.',
      date: '2025-04-10',
      category: 'Obozy'
    },
    {
      id: 3,
      title: 'Nowy harmonogram treningów',
      excerpt: 'Od maja 2025 wprowadzamy nowy harmonogram treningów. Sprawdź aktualny plan dla swojej grupy.',
      date: '2025-04-01',
      category: 'Treningi'
    },
  ];

  nextCamp = {
    name: 'Letni Obóz Szkoleniowy 2025',
    location: 'Krynica-Zdrój',
    dateFrom: '2025-07-07',
    dateTo: '2025-07-21',
    spotsLeft: 8,
  };
}
