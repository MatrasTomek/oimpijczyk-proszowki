import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TrainingSession {
  id: number;
  group_id: number;
  day_of_week: string;
  time_start: string;
  time_morning: string | null;
  workout_type: string | null;
  pool: string | null;
  location: string | null;
  pool_summer: string | null;
  location_summer: string | null;
  sort_order: number;
}

export interface TrainingGroup {
  id: number;
  name: string;
  age_range: string;
  level: string | null;
  sort_order: number;
  sessions: TrainingSession[];
}

@Injectable({ providedIn: 'root' })
export class TrainingsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/trainings`;

  getGroups(): Observable<TrainingGroup[]> {
    return this.http.get<TrainingGroup[]>(`${this.base}/index.php`);
  }

  createGroup(data: Partial<TrainingGroup>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base}/index.php`, data);
  }

  updateGroup(id: number, data: Partial<TrainingGroup>): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.base}/group.php?id=${id}`, data);
  }

  deleteGroup(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.base}/group.php?id=${id}`);
  }

  createSession(data: Partial<TrainingSession>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.base}/sessions.php`, data);
  }

  updateSession(id: number, data: Partial<TrainingSession>): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.base}/sessions.php?id=${id}`, data);
  }

  deleteSession(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.base}/sessions.php?id=${id}`);
  }
}
