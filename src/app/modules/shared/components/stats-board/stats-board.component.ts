import { Chart, ChartType, registerables } from 'chart.js';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';
import 'chartjs-adapter-date-fns';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-stats-board',
  templateUrl: './stats-board.component.html',
  styleUrls: ['./stats-board.component.css'],
})
export class StatsBoardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() userStats?: UserMatchesStats;
  @ViewChild('matchHistoryChart') chartRef!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  faQuestionCircle = faQuestionCircle;

  matchHistory = this.userStats?.matchHistory ?? [];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    console.log('the userStats' + this.userStats);

    console.log('the matchhistory' + this.matchHistory);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
    }, 0); // Asegura que el canvas esté renderizado antes de crear el gráfico
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userStats']) {
      console.log('ngOnChanges:', changes['userStats'].currentValue);
    }
  }

  createChart(): void {
    if (!this.chartRef?.nativeElement) {
      console.error('Canvas not found!');
      return;
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available!');
      return;
    }

    const scatterData = this.matchHistory.map((match) => ({
      x: new Date(match.date).getTime(),
      y: match.rivalRating,
      backgroundColor: match.won ? 'green' : 'red',
    }));

    const scatterColors = this.matchHistory.map((match) =>
      match.won ? 'green' : 'red'
    );

    const lineData = this.matchHistory.map((match) => ({
      x: new Date(match.date).getTime(),
      y: match.userRating,
    }));

    this.chart = new Chart(ctx, {
      type: 'scatter' as ChartType,
      data: {
        datasets: [
          {
            label: 'Rival Rating',
            type: 'scatter',
            data: scatterData,
            pointBackgroundColor: scatterColors,
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 6,
          },
          {
            label: 'User Rating',
            type: 'line',
            data: lineData,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: { unit: 'month' }, // Agrupar por mes en el eje X
            title: { display: true },
          },
          y: {
            title: { display: true, text: 'Rating' },
            beginAtZero: false,
            suggestedMin:
              Math.min(
                ...this.matchHistory.map((m) => m.userRating),
                ...this.matchHistory.map((m) => m.rivalRating)
              ) - 0.5,
            suggestedMax:
              Math.max(
                ...this.matchHistory.map((m) => m.userRating),
                ...this.matchHistory.map((m) => m.rivalRating)
              ) + 0.5,
            ticks: {
              stepSize: 0.25,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => {
                const match = this.matchHistory[tooltipItem.dataIndex];
                return match.won
                  ? ` Victoria -  ${match.rivalName}(${match.rivalRating}) ${match.result}`
                  : ` Derrota -  ${match.rivalName}(${match.rivalRating}) ${match.result}`;
              },
            },
          },
          title: {
            display: true,
            text: 'Historial de Partidos (🟢 = Victoria, 🔴 = Derrota, ━━━ = Rating Usuario)',
            font: { size: 14 },
          },
        },
      },
    });
  }
}
