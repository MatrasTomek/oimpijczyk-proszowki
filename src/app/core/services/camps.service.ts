import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Camp {
  id: number;
  name: string;
  date_from: string;
  date_to: string;
  location: string;
  description: string;
  status: 'upcoming' | 'open' | 'past';
  image_path: string | null;
  spots_total: number;
  spots_left: number;
}

@Injectable({ providedIn: 'root' })
export class CampsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/camps`;

  getAll(): Observable<Camp[]> {
    return this.http.get<Camp[]>(`${this.base}/index.php`);
  }

  getByStatus(status: Camp['status']): Observable<Camp[]> {
    return this.http.get<Camp[]>(`${this.base}/index.php?status=${status}`);
  }

  getById(id: number): Observable<Camp> {
    return this.http.get<Camp>(`${this.base}/item.php?id=${id}`);
  }

  create(data: Partial<Camp>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base}/index.php`, data);
  }

  update(id: number, data: Partial<Camp>): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(
      `${this.base}/item.php?id=${id}`,
      data,
    );
  }

  delete(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(
      `${this.base}/item.php?id=${id}`,
    );
  }

  uploadImage(file: File): Observable<{ filename: string; path: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ filename: string; path: string }>(
      `${this.base}/upload.php`,
      fd,
    );
  }

  imageUrl(path: string): string {
    return `${environment.apiUrl}/${path}`;
  }
}
