import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  AthletesService,
  BestResult,
} from '../../core/services/athletes.service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EChartsOption = Record<string, any>;

type StartWithAthlete = {
  athlete: string;
  rok_urodzenia: number;
  start: {
    basen: string;
    dystans: string;
    styl: string;
    punkty: number | null;
  };
};

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    NgxEchartsDirective,
    ScrollRevealDirective,
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  private athletesService = inject(AthletesService);

  bestResults: BestResult[] = [];
  allStarts: StartWithAthlete[] = [];
  analysisLoading = true;

  poolChartOptions: EChartsOption = {};
  styleChartOptions: EChartsOption = {};
  eventChartOptions: EChartsOption = {};
  athleteChartOptions: EChartsOption = {};

  ngOnInit() {
    this.athletesService.getBestResultsFromLastCompetition().subscribe({
      next: (data) => {
        this.bestResults = data;
      },
      error: () => {},
    });

    this.athletesService.getAllStartsWithPoints().subscribe({
      next: (data) => {
        this.allStarts = data;
        this.buildCharts();
        this.analysisLoading = false;
      },
      error: () => {
        this.analysisLoading = false;
      },
    });
  }

  private buildCharts(): void {
    const TOOLTIP = {
      backgroundColor: '#1e1e1e',
      borderColor: '#2a2a2a',
      textStyle: { color: '#ffffff', fontFamily: 'Open Sans, sans-serif' },
    };
    const AXIS_LABEL = {
      color: '#aaaaaa',
      fontFamily: 'Open Sans, sans-serif',
      fontSize: 12,
    };

    // Pool chart – donut
    const poolCounts: Record<string, number> = {};
    for (const s of this.allStarts) {
      poolCounts[s.start.basen] = (poolCounts[s.start.basen] ?? 0) + 1;
    }
    this.poolChartOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        ...TOOLTIP,
        trigger: 'item',
        formatter: '{b}: {c} startów ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: AXIS_LABEL,
        icon: 'circle',
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '45%'],
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            color: '#ffffff',
            fontSize: 13,
          },
          labelLine: { lineStyle: { color: '#444444' } },
          data: [
            {
              value: poolCounts['25m'] ?? 0,
              name: 'Basen 25m',
              itemStyle: { color: '#F5A623' },
            },
            {
              value: poolCounts['50m'] ?? 0,
              name: 'Basen 50m',
              itemStyle: { color: '#C8891A' },
            },
          ],
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(245,166,35,0.4)' },
          },
        },
      ],
    };

    // Style chart – vertical bar
    const STYLES = [
      'dowolny',
      'grzbietowy',
      'klasyczny',
      'motylkowy',
      'zmienny',
    ];
    const STYLE_LABELS: Record<string, string> = {
      dowolny: 'Dowolny',
      grzbietowy: 'Grzbietowy',
      klasyczny: 'Klasyczny',
      motylkowy: 'Motylkowy',
      zmienny: 'Zmienny',
    };
    const styleCounts: Record<string, number> = {};
    for (const s of this.allStarts) {
      styleCounts[s.start.styl] = (styleCounts[s.start.styl] ?? 0) + 1;
    }
    this.styleChartOptions = {
      backgroundColor: 'transparent',
      tooltip: { ...TOOLTIP, trigger: 'axis' },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: STYLES.map((s) => STYLE_LABELS[s]),
        axisLabel: AXIS_LABEL,
        axisLine: { lineStyle: { color: '#2a2a2a' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#2a2a2a', type: 'dashed' } },
        axisLabel: AXIS_LABEL,
      },
      series: [
        {
          type: 'bar',
          data: STYLES.map((s) => ({
            value: styleCounts[s] ?? 0,
            itemStyle: { color: '#F5A623', borderRadius: [4, 4, 0, 0] },
          })),
          emphasis: { itemStyle: { color: '#FFD077' } },
          barMaxWidth: 60,
        },
      ],
    };

    // Event chart – horizontal bar (top 10)
    const eventCounts: Record<string, number> = {};
    for (const s of this.allStarts) {
      const key = `${s.start.dystans} ${s.start.styl}`;
      eventCounts[key] = (eventCounts[key] ?? 0) + 1;
    }
    const sortedEvents = Object.entries(eventCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    this.eventChartOptions = {
      backgroundColor: 'transparent',
      tooltip: { ...TOOLTIP, trigger: 'axis' },
      grid: {
        left: '1%',
        right: '5%',
        bottom: '3%',
        top: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#2a2a2a', type: 'dashed' } },
        axisLabel: AXIS_LABEL,
      },
      yAxis: {
        type: 'category',
        data: sortedEvents.map((e) => e[0]),
        axisLabel: { ...AXIS_LABEL, fontSize: 11 },
        axisLine: { lineStyle: { color: '#2a2a2a' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: sortedEvents.map((e) => ({
            value: e[1],
            itemStyle: { color: '#F5A623', borderRadius: [0, 4, 4, 0] },
          })),
          emphasis: { itemStyle: { color: '#FFD077' } },
          label: {
            show: true,
            position: 'right',
            color: '#aaaaaa',
            fontSize: 11,
          },
          barMaxWidth: 28,
        },
      ],
    };

    // Athlete chart – horizontal bar (best points per athlete)
    const best: Record<string, number> = {};
    for (const s of this.allStarts) {
      const pts = s.start.punkty!;
      if (!best[s.athlete] || pts > best[s.athlete]) best[s.athlete] = pts;
    }
    const sortedAthletes = Object.entries(best).sort((a, b) => a[1] - b[1]);
    this.athleteChartOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        ...TOOLTIP,
        trigger: 'axis',
        formatter: (params: any) =>
          `${params[0].name}<br/>Najlepszy wynik: <b style="color:#F5A623">${params[0].value} pkt</b>`,
      },
      grid: {
        left: '1%',
        right: '10%',
        bottom: '3%',
        top: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#2a2a2a', type: 'dashed' } },
        axisLabel: AXIS_LABEL,
      },
      yAxis: {
        type: 'category',
        data: sortedAthletes.map((e) => e[0]),
        axisLabel: { ...AXIS_LABEL, fontSize: 11 },
        axisLine: { lineStyle: { color: '#2a2a2a' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: sortedAthletes.map(([, pts]) => ({
            value: pts,
            itemStyle: {
              color:
                pts >= 400
                  ? {
                      type: 'linear' as const,
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        { offset: 0, color: '#C8891A' },
                        { offset: 1, color: '#F5A623' },
                      ],
                    }
                  : '#9a6713',
              borderRadius: [0, 4, 4, 0],
            },
          })),
          label: {
            show: true,
            position: 'right',
            formatter: '{c} pkt',
            color: '#aaaaaa',
            fontSize: 11,
          },
          barMaxWidth: 28,
        },
      ],
    };
  }
}
