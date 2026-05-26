import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Start {
  zawody: string;
  data: string;
  miejscowosc: string;
  basen: string;
  konkurencja_nr: number;
  dystans: string;
  styl: string;
  plec: string;
  tor: number;
  czas: string;
  punkty: number | null;
  timestamp_pobrania: string;
}

export interface Athlete {
  imie: string;
  nazwisko: string;
  rok_urodzenia: number;
  klub: string;
  starty: Start[];
}

export interface AthletesData {
  [key: string]: Athlete;
}

export interface BestResult {
  zawodnik: string;
  rok_urodzenia: number;
  zawody: string;
  miejscowosc: string;
  dystans: string;
  styl: string;
  basen: string;
  czas: string;
  punkty: number;
}

export interface StartWithAthlete {
  athlete: string;
  rok_urodzenia: number;
  start: Start;
}

@Injectable({ providedIn: 'root' })
export class AthletesService {
  private http = inject(HttpClient);
  private dataUrl = '/assets/zawodnicy.json';

  getBestResultsFromLastCompetition(): Observable<BestResult[]> {
    return this.http.get<AthletesData>(this.dataUrl).pipe(
      map((data) => {
        const results: BestResult[] = [];

        for (const key of Object.keys(data)) {
          const zawodnik = data[key];
          const starty = zawodnik.starty.filter((s) => s.punkty !== null);
          if (!starty.length) continue;

          const maxTimestamp = starty.reduce(
            (max, s) =>
              s.timestamp_pobrania > max ? s.timestamp_pobrania : max,
            starty[0].timestamp_pobrania,
          );

          const lastBatch = starty.filter(
            (s) => s.timestamp_pobrania === maxTimestamp,
          );

          const best = lastBatch.reduce(
            (b, s) => ((s.punkty ?? 0) > (b.punkty ?? 0) ? s : b),
            lastBatch[0],
          );

          results.push({
            zawodnik: `${zawodnik.imie} ${zawodnik.nazwisko}`,
            rok_urodzenia: zawodnik.rok_urodzenia,
            zawody: best.zawody,
            miejscowosc: best.miejscowosc,
            dystans: best.dystans,
            styl: best.styl,
            basen: best.basen,
            czas: best.czas,
            punkty: best.punkty!,
          });
        }

        return results.sort((a, b) => b.punkty - a.punkty);
      }),
    );
  }

  getAllStartsWithPoints(): Observable<StartWithAthlete[]> {
    return this.http.get<AthletesData>(this.dataUrl).pipe(
      map((data) => {
        const results: StartWithAthlete[] = [];
        for (const key of Object.keys(data)) {
          const z = data[key];
          const name = `${z.imie} ${z.nazwisko}`;
          for (const start of z.starty) {
            if (start.punkty !== null) {
              results.push({ athlete: name, rok_urodzenia: z.rok_urodzenia, start });
            }
          }
        }
        return results;
      }),
    );
  }
}
