import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';
import 'chartjs-adapter-date-fns';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

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

  matchHistory = [
    { date: '2024-01-10', rivalRating: 3.2, userRating: 3.4, won: true, rivalName: 'Juan Pablo', result: '6-0, 6-0' },
    { date: '2024-01-12', rivalRating: 3.6, userRating: 3.5, won: false, rivalName: 'Carlos', result: '4-6, 3-6' },
    { date: '2024-02-15', rivalRating: 3.9, userRating: 3.7, won: true, rivalName: 'Andrés', result: '7-5, 6-3' },
    { date: '2024-02-18', rivalRating: 4.1, userRating: 3.65, won: false, rivalName: 'Felipe', result: '3-6, 2-6' },
    { date: '2024-02-20', rivalRating: 3.5, userRating: 3.8, won: true, rivalName: 'David', result: '6-4, 6-4' },
    { date: '2024-02-22', rivalRating: 4.3, userRating: 3.53, won: false, rivalName: 'Sebastián', result: '5-7, 4-6' },
    { date: '2024-02-25', rivalRating: 3.8, userRating: 3.83, won: true, rivalName: 'Mateo', result: '6-2, 6-3' },
    { date: '2024-02-28', rivalRating: 3.9, userRating: 3.88, won: true, rivalName: 'Luis', result: '6-1, 7-5' },
    { date: '2024-03-01', rivalRating: 4.4, userRating: 3.72, won: false, rivalName: 'Miguel', result: '3-6, 4-6' },
    { date: '2024-03-03', rivalRating: 4.0, userRating: 3.76, won: false, rivalName: 'Fernando', result: '2-6, 5-7' },
    { date: '2024-03-06', rivalRating: 3.7, userRating: 3.81, won: true, rivalName: 'Jorge', result: '6-3, 6-4' },
    { date: '2024-03-08', rivalRating: 3.95, userRating: 3.79, won: true, rivalName: 'Raúl', result: '6-4, 6-3' },
    { date: '2024-03-10', rivalRating: 4.2, userRating: 3.68, won: false, rivalName: 'Tomás', result: '4-6, 3-6' },
    { date: '2024-03-12', rivalRating: 3.85, userRating: 3.84, won: true, rivalName: 'Nicolás', result: '7-6, 6-3' },
  ];
  

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {}

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

    const scatterColors = this.matchHistory.map((match) => (match.won ? 'green' : 'red'));

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
          }
          
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
            suggestedMin: Math.min(...this.matchHistory.map(m => m.userRating), ...this.matchHistory.map(m => m.rivalRating)) - 0.5,
            suggestedMax: Math.max(...this.matchHistory.map(m => m.userRating), ...this.matchHistory.map(m => m.rivalRating)) + 0.5,
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
