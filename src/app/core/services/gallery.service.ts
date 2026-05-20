import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GalleryImage {
  id: number;
  title: string | null;
  category: string;
  filename: string;
  uploaded_at: string;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/gallery`;

  getAll(category?: string): Observable<GalleryImage[]> {
    const url = category
      ? `${this.base}/index.php?category=${encodeURIComponent(category)}`
      : `${this.base}/index.php`;
    return this.http.get<GalleryImage[]>(url);
  }

  imageUrl(filename: string): string {
    return `${environment.apiUrl}/uploads/gallery/${filename}`;
  }

  upload(file: File, title: string, category: string): Observable<{ id: number; filename: string }> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('category', category);
    return this.http.post<{ id: number; filename: string }>(`${this.base}/upload.php`, fd);
  }

  delete(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.base}/item.php?id=${id}`);
  }
}
