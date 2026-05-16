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
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  stats = [
    { value: '5+', label: 'Lat aktywności' },
    { value: '50+', label: 'Imprez rocznie' },
    { value: '200+', label: 'Medali' },
    { value: '30+', label: 'Miast odwiedzonych' },
  ];

  presenceItems = [
    {
      icon: 'pi-flag',
      title: 'Zawody ogólnopolskie',
      description:
        'Startujemy na basenach w całej Polsce — od Trójmiasta po Podhale. Nasze stroje i barwy klubowe są obecne na najważniejszych imprezach pływackich w kraju przez cały sezon.',
      metric: '20+',
      metricLabel: 'zawodów w sezonie',
      image: null,
    },
    {
      icon: 'pi-map-marker',
      title: 'Obozy szkoleniowe',
      description:
        'Kilka razy w roku wyjeżdżamy na wielodniowe obozy szkoleniowe w różnych regionach Polski. Nasi zawodnicy trenują i reprezentują klub poza Małopolską.',
      metric: '4',
      metricLabel: 'obozy w roku',
      image: 'assets/all_2.jpg',
    },
    {
      icon: 'pi-star',
      title: 'Mistrzostwa i finały',
      description:
        'Regularnie rywalizujemy na Mistrzostwach Małopolski i zawodach rangi krajowej, gdzie skupia się uwaga mediów sportowych, kibiców i rodzin zawodników.',
      metric: '5+',
      metricLabel: 'finałów krajowych',
      image: null,
    },
    {
      icon: 'pi-users',
      title: 'Lokalne i regionalne imprezy',
      description:
        'Aktywnie uczestniczymy w życiu sportowym Małopolski — festyny, biegi, gale sportowe. Jesteśmy rozpoznawalną twarzą sportu w naszym regionie.',
      metric: '10+',
      metricLabel: 'eventów lokalnych',
      image: 'assets/all-start.jpeg',
    },
  ];

  latestNews: NewsItem[] = [
    {
      id: 1,
      title: 'Sukces na Mistrzostwach Małopolski',
      excerpt:
        'Nasi zawodnicy zdobyli 5 złotych medali na tegorocznych Mistrzostwach Małopolski w Pływaniu.',
      date: '2025-04-20',
      category: 'Wyniki',
    },
    {
      id: 2,
      title: 'Letni Obóz Szkoleniowy 2025',
      excerpt:
        'Zapisy na letni obóz szkoleniowy już otwarte! Zapraszamy zawodników wszystkich grup wiekowych.',
      date: '2025-04-10',
      category: 'Obozy',
    },
    {
      id: 3,
      title: 'Nowy harmonogram treningów',
      excerpt:
        'Od maja 2025 wprowadzamy nowy harmonogram treningów. Sprawdź aktualny plan dla swojej grupy.',
      date: '2025-04-01',
      category: 'Treningi',
    },
  ];

  bgImage(path: string | null): string {
    return path ? `url(${path})` : '';
  }

  categoryRoute(category: string): string {
    const map: Record<string, string> = {
      Wyniki: '/wyniki',
      Obozy: '/obozy',
      Treningi: '/treningi',
    };
    return map[category] ?? '/';
  }

  nextCamp = {
    name: 'Letni Obóz Szkoleniowy 2025',
    location: 'Krynica-Zdrój',
    dateFrom: '2025-07-07',
    dateTo: '2025-07-21',
    spotsLeft: 8,
  };
}
