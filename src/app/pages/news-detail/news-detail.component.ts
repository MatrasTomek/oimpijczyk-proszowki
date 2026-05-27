import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { NewsService, NewsItem } from '../../core/services/news.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TagModule],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);

  news: NewsItem | null = null;
  error = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.newsService.getById(id).subscribe({
      next: (item) => { this.news = item; },
      error: () => { this.error = true; },
    });
  }

  imageUrl(path: string): string {
    return `${environment.apiUrl}/${path}`;
  }
}
