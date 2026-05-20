import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Result {
  id: number;
  athlete: string;
  competition: string;
  discipline: string;
  result_time: string;
  place: number;
  competition_date: string;
}

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/results`;

  getAll(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.base}/index.php`);
  }

  create(data: Partial<Result>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base}/index.php`, data);
  }

  update(id: number, data: Partial<Result>): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.base}/item.php?id=${id}`, data);
  }

  delete(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.base}/item.php?id=${id}`);
  }
}
