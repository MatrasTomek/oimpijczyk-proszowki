import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SekcjaBFormData {
  imieDziecka: string;
  nazwiskoDziecka: string;
  wiekDziecka: number;
  stylePlywackie: string[];
  imieOpiekuna: string;
  nazwiskoOpiekuna: string;
  telefon: string;
  email: string;
  uwagi: string;
  rodo: boolean;
}

@Injectable({ providedIn: 'root' })
export class SekcjaBService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/sekcjab`;

  send(data: SekcjaBFormData): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.base}/index.php`, data);
  }
}
