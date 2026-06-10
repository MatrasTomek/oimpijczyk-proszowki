import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import {
  AthletesService,
  LastCompetitionResult,
  Athlete,
  AthletesData,
  Start,
} from '../../core/services/athletes.service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EChartsOption = Record<string, any>;

interface AthleteOption {
  label: string;
  value: string;
}

interface AthleteStats {
  totalStarts: number;
  bestPoints: number;
  competitions: number;
  events: number;
}

const COLORS = [
  '#F5A623',
  '#4FC3F7',
  '#81C784',
  '#CE93D8',
  '#FF8A65',
  '#4DD0E1',
  '#FFD54F',
  '#EF9A9A',
];

const TOOLTIP_BASE = {
  backgroundColor: '#1e1e1e',
  borderColor: '#333333',
  textStyle: {
    color: '#ffffff',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: 12,
  },
};

const AXIS_LABEL_BASE = {
  color: '#aaaaaa',
  fontFamily: 'Open Sans, sans-serif',
  fontSize: 11,
};

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectModule,
    NgxEchartsDirective,
    ScrollRevealDirective,
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  private athletesService = inject(AthletesService);

  lastCompResults: LastCompetitionResult[] = [];

  athleteOptions: AthleteOption[] = [];
  selectedAthleteKey = '';
  selectedAthlete: Athlete | null = null;
  athleteStats: AthleteStats | null = null;
  athleteStarts: Start[] = [];
  analysisLoading = true;

  private athletesData: AthletesData | null = null;

  progressChartOptions: EChartsOption = {};
  eventBestChartOptions: EChartsOption = {};
  styleChartOptions: EChartsOption = {};

  ngOnInit(): void {
    this.athletesService.getLastCompetitionResults().subscribe({
      next: (data) => (this.lastCompResults = data),
      error: () => {},
    });

    this.athletesService.getAthletesData().subscribe({
      next: (data) => {
        this.athletesData = data;
        this.athleteOptions = Object.entries(data).map(([key, a]) => ({
          label: `${a.imie} ${a.nazwisko}`,
          value: key,
        }));
        if (this.athleteOptions.length > 0) {
          this.selectedAthleteKey = this.athleteOptions[0].value;
          this.refreshAnalysis();
        }
        this.analysisLoading = false;
      },
      error: () => {
        this.analysisLoading = false;
      },
    });
  }

  onAthleteChange(): void {
    this.refreshAnalysis();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    return `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[2]}`;
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '—';
    if (!/[:.]/.test(timeStr) && /^\d+$/.test(timeStr)) return '?';
    return timeStr.replace(/^00:00:/, '').replace(/^00:0?/, '');
  }

  private normalizeStyl(styl: string): string {
    return styl.replace(/\s+Lap$/i, '').trim();
  }

  private competitionDateSortKey(dateStr: string): string {
    if (dateStr) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }
    return '0000-00-00';
  }

  private batchKey(s: { zawody: string; data: string }): string {
    const parts = s.data.split('/');
    const monthYear = parts.length === 3 ? `${parts[1]}/${parts[2]}` : '';
    return `${s.zawody}|${monthYear}`;
  }

  private refreshAnalysis(): void {
    if (!this.athletesData || !this.selectedAthleteKey) return;
    const athlete = this.athletesData[this.selectedAthleteKey];
    this.selectedAthlete = athlete;

    const startsWithPts = athlete.starty.filter((s) => s.punkty !== null);
    const uniqueComps = new Set(athlete.starty.map((s) => this.batchKey(s)));
    const uniqueEvents = new Set(
      startsWithPts.map((s) => `${s.dystans} ${this.normalizeStyl(s.styl)}`),
    );

    this.athleteStats = {
      totalStarts: athlete.starty.length,
      bestPoints: startsWithPts.length
        ? Math.max(...startsWithPts.map((s) => s.punkty!))
        : 0,
      competitions: uniqueComps.size,
      events: uniqueEvents.size,
    };

    this.athleteStarts = [...athlete.starty].sort((a, b) =>
      this.competitionDateSortKey(a.data).localeCompare(
        this.competitionDateSortKey(b.data),
      ),
    );

    this.buildProgressChart(athlete);
    this.buildEventBestChart(athlete);
    this.buildStyleChart(athlete);
  }

  private buildProgressChart(athlete: Athlete): void {
    const compBatches = new Map<
      string,
      { zawody: string; location: string; data: string; starts: Start[] }
    >();
    for (const s of athlete.starty) {
      const key = this.batchKey(s);
      if (!compBatches.has(key)) {
        compBatches.set(key, {
          zawody: s.zawody,
          location: s.miejscowosc,
          data: s.data,
          starts: [],
        });
      }
      const batch = compBatches.get(key)!;
      if (
        this.competitionDateSortKey(s.data) <
        this.competitionDateSortKey(batch.data)
      ) {
        batch.data = s.data;
      }
      batch.starts.push(s);
    }

    const sortedBatches = Array.from(compBatches.entries()).sort(
      ([, bA], [, bB]) =>
        this.competitionDateSortKey(bA.data).localeCompare(
          this.competitionDateSortKey(bB.data),
        ),
    );

    // Detect duplicate short names to append month/year suffix
    const shortNames = sortedBatches.map(([, g]) =>
      g.zawody.length > 20 ? g.zawody.slice(0, 19) + '…' : g.zawody,
    );
    const nameCounts = shortNames.reduce<Record<string, number>>((acc, n) => {
      acc[n] = (acc[n] ?? 0) + 1;
      return acc;
    }, {});
    const xLabels = sortedBatches.map(([, g], i) => {
      const name = shortNames[i];
      if (nameCounts[name] > 1) {
        const parts = g.data.split('/');
        const suffix =
          parts.length === 3 ? ` (${parts[1]}/${parts[2].slice(2)})` : '';
        return name + suffix;
      }
      return name;
    });

    const allEvents = Array.from(
      new Set(
        athlete.starty
          .filter((s) => s.punkty !== null)
          .map((s) => `${s.dystans} ${this.normalizeStyl(s.styl)}`),
      ),
    );

    const series = allEvents
      .map((event, idx) => {
        const data = sortedBatches.map(([, group]) => {
          const match = group.starts.find(
            (s) =>
              `${s.dystans} ${this.normalizeStyl(s.styl)}` === event &&
              s.punkty !== null,
          );
          if (!match) return null;
          return {
            value: match.punkty,
            czas: match.czas,
            zawody: `${group.zawody}, ${group.location}`,
          };
        });

        if (!data.some((d) => d !== null)) return null;

        const color = COLORS[idx % COLORS.length];
        return {
          name: event,
          type: 'line',
          data,
          itemStyle: { color },
          lineStyle: { color, width: 2 },
          symbol: 'circle',
          symbolSize: 7,
          connectNulls: false,
          emphasis: { focus: 'series', scale: true },
        };
      })
      .filter((s) => s !== null);

    const formatTime = (t: string) => this.formatTime(t);

    this.progressChartOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        ...TOOLTIP_BASE,
        trigger: 'axis',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any[]) => {
          const idx = params[0]?.dataIndex;
          const batch = sortedBatches[idx]?.[1];
          if (!batch) return '';
          const heading = `${batch.zawody}, ${batch.location} <span style="color:#666">(${this.formatDate(batch.data)})</span>`;
          let rows = '';
          for (const p of params) {
            if (p.data === null || p.data === undefined) continue;
            rows += `
              <div style="display:flex;align-items:center;gap:8px;margin:3px 0">
                <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${p.color};flex-shrink:0"></span>
                <span style="flex:1">${p.seriesName}</span>
                <b style="color:${p.color}">${p.data.value}&nbsp;pkt</b>
                <span style="color:#777;font-size:11px">${formatTime(p.data.czas)}</span>
              </div>`;
          }
          return `<div style="font-family:Open Sans,sans-serif;font-size:12px">
            <div style="font-weight:700;margin-bottom:6px;font-size:13px">${heading}</div>
            ${rows}
          </div>`;
        },
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        textStyle: AXIS_LABEL_BASE,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        pageIconSize: 10,
        pageTextStyle: { color: '#666', fontSize: 10 },
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom:
          window.innerWidth < 768
            ? `${Math.min(45, 18 + allEvents.length * 3)}%`
            : '18%',
        top: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLabel: { ...AXIS_LABEL_BASE, rotate: 20, interval: 0 },
        axisLine: { lineStyle: { color: '#2a2a2a' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'pkt',
        nameTextStyle: { color: '#666', fontSize: 10 },
        axisLabel: AXIS_LABEL_BASE,
        splitLine: { lineStyle: { color: '#2a2a2a', type: 'dashed' } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        min: (v: any) => Math.max(0, Math.floor(v.min * 0.88)),
      },
      series,
    };
  }

  private buildEventBestChart(athlete: Athlete): void {
    const bestPerEvent: Record<string, { points: number; czas: string }> = {};
    for (const s of athlete.starty) {
      if (s.punkty === null) continue;
      const key = `${s.dystans} ${this.normalizeStyl(s.styl)} (${s.basen})`;
      if (!bestPerEvent[key] || s.punkty > bestPerEvent[key].points) {
        bestPerEvent[key] = { points: s.punkty, czas: s.czas };
      }
    }

    const sorted = Object.entries(bestPerEvent).sort(
      (a, b) => b[1].points - a[1].points,
    );

    const formatTime = (t: string) => this.formatTime(t);

    this.eventBestChartOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        ...TOOLTIP_BASE,
        trigger: 'axis',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any[]) => {
          const p = params[0];
          const entry = sorted[p.dataIndex]?.[1];
          return `<b>${p.name}</b><br/>Najlepszy: <b style="color:#F5A623">${p.value} pkt</b><br/>Czas: ${entry ? formatTime(entry.czas) : ''}`;
        },
      },
      grid: {
        left: '1%',
        right: '14%',
        bottom: '5%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: AXIS_LABEL_BASE,
        splitLine: { lineStyle: { color: '#2a2a2a', type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: sorted.map(([k]) => k),
        axisLabel: { ...AXIS_LABEL_BASE, fontSize: 11 },
        axisLine: { lineStyle: { color: '#2a2a2a' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: sorted.map(([, v]) => ({
            value: v.points,
            itemStyle: {
              color:
                v.points >= 400
                  ? {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        { offset: 0, color: '#C8891A' },
                        { offset: 1, color: '#F5A623' },
                      ],
                    }
                  : v.points >= 200
                    ? '#C8891A'
                    : '#9a6713',
              borderRadius: [0, 4, 4, 0],
            },
          })),
          label: {
            show: true,
            position: 'right',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (p: any) => `${p.value} pkt`,
            color: '#aaaaaa',
            fontSize: 11,
          },
          barMaxWidth: 26,
          emphasis: { itemStyle: { opacity: 0.8 } },
        },
      ],
    };
  }

  private buildStyleChart(athlete: Athlete): void {
    const STYLE_COLORS: Record<string, string> = {
      dowolny: '#F5A623',
      grzbietowy: '#4FC3F7',
      klasyczny: '#81C784',
      motylkowy: '#CE93D8',
      zmienny: '#FF8A65',
    };

    const styleCounts: Record<string, number> = {};
    for (const s of athlete.starty) {
      const styl = this.normalizeStyl(s.styl);
      styleCounts[styl] = (styleCounts[styl] ?? 0) + 1;
    }

    const data = Object.entries(styleCounts).map(([styl, count]) => ({
      name: styl.charAt(0).toUpperCase() + styl.slice(1),
      value: count,
      itemStyle: { color: STYLE_COLORS[styl] ?? '#888888' },
    }));

    this.styleChartOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        ...TOOLTIP_BASE,
        trigger: 'item',
        formatter: '{b}: {c} startów ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: AXIS_LABEL_BASE,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '44%'],
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            color: '#ffffff',
            fontSize: 12,
          },
          labelLine: { lineStyle: { color: '#444444' } },
          data,
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(245,166,35,0.3)' },
          },
        },
      ],
    };
  }
}
