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
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stats-board',
  templateUrl: './stats-board.component.html',
  styleUrls: ['./stats-board.component.css'],
})
export class StatsBoardComponent implements OnChanges, AfterViewInit {
  @Input() userStats?: UserMatchesStats;
  @ViewChild('matchHistoryChart') chartRef!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  faQuestionCircle = faQuestionCircle;

  matchHistory = this.userStats?.matchHistory ?? [];

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userStats']?.currentValue) {
      console.log('ngOnChanges:', changes['userStats'].currentValue);
      this.matchHistory = this.userStats?.matchHistory ?? [];

      if (this.chart) {
        this.chart.destroy();
      }

      this.showLoader();

      setTimeout(() => {
        this.createChart();
        Swal.close();
      }, 0);
    }
  }

  private showLoader(): void {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera mientras se cargan los datos.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
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

    // **💥 Destruir el gráfico existente si ya hay uno creado**
    if (this.chart) {
      this.chart.destroy();
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
            time: { unit: 'week' },
            title: { display: false, text: 'Fecha' },
            ticks: {
              autoSkip: false,
            },
            min:
              Math.min(
                ...this.matchHistory.map((m) => new Date(m.date).getTime())
              ) - 86400000, // Resta 1 día en ms
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
