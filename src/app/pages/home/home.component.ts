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
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  stats = [
    { value: '5+', label: 'Lat' },
    { value: '150+', label: 'Imprez' },
    { value: '300+', label: 'Medali' },
    { value: '30+', label: 'Miast' },
    { value: '6+', label: 'Krajów' },
  ];

  presenceItems = [
    {
      icon: 'pi-star',
      title: 'Mistrzostwa Polski - Poznań',
      description:
        'Nszi zawodnicy rywalizuja w Mistrzostwach Polski, które są jednym z najważniejszych wydarzeń w kalendarzu pływackim. To tutaj zdobywamy medale i budujemy naszą reputację na arenie krajowej.',
      metric: '4+',
      metricLabel: 'mistrzostwa krajowe w roku',
      image: 'assets/mp_poznan.jpg',
    },
    {
      icon: 'pi-flag',
      title: 'Arena Talent Trophy - Eindhoven',
      description:
        'Kilka razy w roku wyjeżdżamy na międzynarodowae zawody, aby nasi zawodnicy poczuli klimat rywalizacji na najwyższym poziomie.',
      metric: '4+',
      metricLabel: 'Zawody międzynarodowe w roku',
      image: 'assets/me_eindhoven.jpeg',
    },
    {
      icon: 'pi-map-marker',
      title: 'Mistrzostwa i finały Okregowe - Oświęcim',
      description:
        'Regularnie rywalizujemy na Mistrzostwach Małopolski i zawodach rangi krajowej, gdzie skupia się uwaga mediów sportowych, kibiców i rodzin zawodników.',
      metric: '25+',
      metricLabel: 'zawody i finały okregowe w roku',
      image: 'assets/zo_oswiecim.jpg',
    },
    {
      icon: 'pi-map-marker',
      title: 'Ogólnopolskie imprezy Kielce/Lublin/Gliwice/Łódź',
      description:
        'Aktywnie uczestniczymy w pływackim życiu sportowym nie tylko naszego regionu. Jesteśmy rozpoznawalną twarzą sportu w całym kraju.',
      metric: '10+',
      metricLabel: 'eventów krajowych w roku',
      image: 'assets/me_kielce.jpg',
    },
    {
      icon: 'pi-star',
      title: 'Aktywny czas nie tylko w pływaniu',
      description:
        'Spędzamy czas aktywnie również poza basenem, uczestnicząc w różnych wydarzeniach sportowych i rekreacyjnych.',
      metric: '10+',
      metricLabel: 'spotkanie integracyjne',
      image: 'assets/oo_rowery.jpeg',
    },
    {
      icon: 'pi-star',
      title: 'Zimowe aktywności - Ptaszkowa',
      description:
        'Formę utrzymujemy również zimą, poza oczywiście pływaniem uczestniczymy w eventach na świeżym powietrzu.',
      metric: '10+',
      metricLabel: 'spotkanie integracyjne',
      image: 'assets/nn_ptaszkowa.jpg',
    },
  ];

  latestNews: NewsItem[] = [
    {
      id: 1,
      title: 'Sukces na Międzynarodowych zawodach w Eindhovn',
      excerpt:
        'Nasi zawodnicy zdobyli cenne doświadczenia i złote medale na Międzynarodowych zawodach w Eindhovn.',
      date: '2026-04-20',
      category: 'Wyniki',
    },
    {
      id: 2,
      title: 'Zimowy Obóz Szkoleniowy 2026',
      excerpt:
        'Zimowy obóz szkoleniowy  w Szczyrku przyniósł wiele cennych doświadczeń naszym zawodnikom.',
      date: '2026-02-10',
      category: 'Obozy',
    },
    {
      id: 3,
      title: 'Nowy harmonogram treningów',
      excerpt:
        'Od maja 2026 wprowadzamy nowy harmonogram treningów. Sprawdź aktualny plan dla swojej grupy.',
      date: '2026-04-01',
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
    name: 'Letni Obóz Szkoleniowy 2026',
    location: 'Krynica-Zdrój',
    dateFrom: '2026-07-07',
    dateTo: '2026-07-21',
    spotsLeft: 8,
  };
}
