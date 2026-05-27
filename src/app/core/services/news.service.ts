import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_path: string | null;
  published_at: string;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/news`;

  getAll(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(`${this.base}/index.php`);
  }

  getLatest(limit: number): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(`${this.base}/index.php?limit=${limit}`);
  }

  getById(id: number): Observable<NewsItem> {
    return this.http.get<NewsItem>(`${this.base}/item.php?id=${id}`);
  }

  create(data: Partial<NewsItem>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base}/index.php`, data);
  }

  update(id: number, data: Partial<NewsItem>): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.base}/item.php?id=${id}`, data);
  }

  delete(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.base}/item.php?id=${id}`);
  }

  uploadImage(file: File): Observable<{ filename: string; path: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ filename: string; path: string }>(`${this.base}/upload.php`, fd);
  }

  imageUrl(path: string): string {
    return `${environment.apiUrl}/${path}`;
  }
}
