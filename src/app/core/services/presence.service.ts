import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PresenceItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  icon: string;
  image_path: string | null;
  sort_order: number;
  active: number;
}

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/presence`;

  getAll(): Observable<PresenceItem[]> {
    return this.http.get<PresenceItem[]>(`${this.base}/index.php`);
  }

  imageUrl(path: string): string {
    return `${environment.apiUrl}/${path}`;
  }

  uploadImage(file: File): Observable<{ filename: string; path: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ filename: string; path: string }>(`${this.base}/upload.php`, fd);
  }

  create(data: Partial<PresenceItem>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base}/index.php`, data);
  }

  update(id: number, data: Partial<PresenceItem>): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.base}/item.php?id=${id}`, data);
  }

  delete(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.base}/item.php?id=${id}`);
  }
}
