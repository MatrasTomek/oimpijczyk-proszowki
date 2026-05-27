import { Component, AfterViewInit, OnDestroy, inject, PLATFORM_ID, NgZone, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { NewsService, NewsItem } from '../../core/services/news.service';
import { PresenceService } from '../../core/services/presence.service';
import { environment } from '../../../environments/environment';

interface PresenceDisplay {
  icon: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  image: string | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, TagModule, ScrollRevealDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private newsService = inject(NewsService);
  private presenceService = inject(PresenceService);
  private counterObserver?: IntersectionObserver;
  private countersStarted = false;

  stats = [
    { value: '5+',   label: 'Lat' },
    { value: '150+', label: 'Imprez' },
    { value: '300+', label: 'Medali' },
    { value: '30+',  label: 'Miast' },
    { value: '6+',   label: 'Krajów' },
  ];

  displayStats = this.stats.map(s => s.value);

  presenceItems: PresenceDisplay[] = [];
  latestNews: NewsItem[] = [];

  presenceItemsFallback: PresenceDisplay[] = [
    {
      icon: 'pi-star',
      title: 'Mistrzostwa Polski — Poznań',
      description:
        'Nasi zawodnicy rywalizują w Mistrzostwach Polski, które są jednym z najważniejszych wydarzeń w kalendarzu pływackim. To tutaj zdobywamy medale i budujemy reputację na arenie krajowej.',
      metric: '4+',
      metricLabel: 'mistrzostwa krajowe w roku',
      image: 'assets/mp_poznan.jpg',
    },
    {
      icon: 'pi-flag',
      title: 'Arena Talent Trophy — Eindhoven',
      description:
        'Kilka razy w roku wyjeżdżamy na zawody międzynarodowe, aby nasi zawodnicy poczuli klimat rywalizacji na najwyższym poziomie.',
      metric: '4+',
      metricLabel: 'zawody międzynarodowe w roku',
      image: 'assets/me_eindhoven.jpeg',
    },
    {
      icon: 'pi-map-marker',
      title: 'Mistrzostwa i finały okręgowe — Oświęcim',
      description:
        'Regularnie rywalizujemy na Mistrzostwach Małopolski i zawodach rangi krajowej, gdzie skupia się uwaga mediów sportowych, kibiców i rodzin zawodników.',
      metric: '25+',
      metricLabel: 'zawody i finały okręgowe w roku',
      image: 'assets/zo_oswiecim.jpg',
    },
    {
      icon: 'pi-map-marker',
      title: 'Ogólnopolskie imprezy — Kielce / Lublin / Łódź',
      description:
        'Aktywnie uczestniczymy w pływackim życiu sportowym nie tylko naszego regionu. Jesteśmy rozpoznawalną twarzą sportu w całym kraju.',
      metric: '10+',
      metricLabel: 'eventów krajowych w roku',
      image: 'assets/me_kielce.jpg',
    },
    {
      icon: 'pi-star',
      title: 'Aktywny czas — nie tylko w pływaniu',
      description:
        'Spędzamy czas aktywnie również poza basenem, uczestnicząc w różnych wydarzeniach sportowych i rekreacyjnych.',
      metric: '10+',
      metricLabel: 'spotkań integracyjnych',
      image: 'assets/oo_rowery.jpeg',
    },
    {
      icon: 'pi-star',
      title: 'Zimowe aktywności — Ptaszkowa',
      description:
        'Formę utrzymujemy również zimą. Poza pływaniem uczestniczymy w eventach na świeżym powietrzu i obozach zimowych.',
      metric: '10+',
      metricLabel: 'spotkań integracyjnych',
      image: 'assets/nn_ptaszkowa.jpg',
    },
  ];

  latestNewsFallback: NewsItem[] = [
    {
      id: 1,
      title: 'Sukces na Międzynarodowych zawodach w Eindhoven',
      excerpt:
        'Nasi zawodnicy zdobyli cenne doświadczenia i złote medale na Międzynarodowych zawodach w Eindhoven. Doskonały wynik na arenie europejskiej.',
      content: '',
      published_at: '2026-04-20',
      category: 'Wyniki',
      image_path: null,
    },
    {
      id: 2,
      title: 'Zimowy Obóz Szkoleniowy 2026',
      excerpt:
        'Zimowy obóz szkoleniowy w Szczyrku przyniósł wiele cennych doświadczeń naszym zawodnikom.',
      content: '',
      published_at: '2026-02-10',
      category: 'Obozy',
      image_path: null,
    },
    {
      id: 3,
      title: 'Nowy harmonogram treningów od maja',
      excerpt:
        'Od maja 2026 wprowadzamy nowy harmonogram treningów. Sprawdź aktualny plan dla swojej grupy.',
      content: '',
      published_at: '2026-04-01',
      category: 'Treningi',
      image_path: null,
    },
  ];

  ngOnInit() {
    this.presenceService.getAll().subscribe({
      next: (items) => {
        if (items.length > 0) {
          this.presenceItems = items.map(item => ({
            icon: item.icon ?? 'pi-star',
            title: item.title,
            description: item.description,
            metric: item.metric,
            metricLabel: item.subtitle,
            image: item.image_path ? `${environment.apiUrl}/${item.image_path}` : null,
          }));
        } else {
          this.presenceItems = this.presenceItemsFallback;
        }
      },
      error: () => { this.presenceItems = this.presenceItemsFallback; },
    });

    this.newsService.getLatest(3).subscribe({
      next: (items) => { this.latestNews = items.length > 0 ? items : this.latestNewsFallback; },
      error: () => { this.latestNews = this.latestNewsFallback; },
    });
  }

  bgImage(path: string | null): string {
    return path ? `url(${path})` : '';
  }

  newsImageUrl(path: string): string {
    return `${environment.apiUrl}/${path}`;
  }

  nextCamp = {
    name: 'Letni Obóz Szkoleniowy 2026',
    location: 'Krynica-Zdrój',
    dateFrom: '2026-07-07',
    dateTo: '2026-07-21',
    spotsLeft: 8,
  };

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initCounterObserver();
  }

  private initCounterObserver() {
    const statsEl = document.querySelector('.stats-section');
    if (!statsEl) return;

    this.counterObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !this.countersStarted) {
          this.countersStarted = true;
          this.animateAllCounters();
        }
      },
      { threshold: 0.4 }
    );
    this.counterObserver.observe(statsEl);
  }

  private animateAllCounters() {
    this.stats.forEach((stat, i) => {
      const match = stat.value.match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1]);
      const suffix = match[2];
      const duration = 1600;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        this.ngZone.run(() => {
          this.displayStats[i] = current + suffix;
        });
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  ngOnDestroy() {
    this.counterObserver?.disconnect();
  }
}
