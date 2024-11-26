import { TimeFormatPipe } from './../../../shared/pipes/time-format.pipe';
import { AppState } from './../../../../state/app.state';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart, ChartType, registerables } from 'chart.js';
import { format, subDays } from 'date-fns';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import {
  ClubReportDTO,
  ReportReservationByUserDTO,
} from 'src/app/models/ClubReport.model';
import { loadClubReport } from 'src/app/state/actions/report.actions';
import { selectClubReport } from 'src/app/state/selectors/report.selectors';

@Component({
  selector: 'app-club-reports',
  templateUrl: './club-reports.component.html',
  providers: [TimeFormatPipe],
})
export class ClubReportsComponent implements OnInit, OnDestroy {
  report$: Observable<{
    loading: boolean;
    report: ClubReportDTO | null;
    error: string | null;
  }> = this.store.select(selectClubReport);

  startDate!: string;
  endDate!: string;
  private charts: { [key: string]: Chart } = {};
  users: ReportReservationByUserDTO[] = [];
  private reportSubscription!: Subscription;

  constructor(
    private readonly store: Store<AppState>,
    private readonly timeFormatPipe: TimeFormatPipe
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const today = new Date();
    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(subDays(today, 7));

    this.showLoader();

    this.store.dispatch(
      loadClubReport({ initialDate: this.startDate, endDate: this.endDate })
    );

    this.reportSubscription = this.report$.subscribe(
      ({ loading, report, error }) => {
        if (loading) {
          return; // Do nothing if still loading
        }

        this.dismissLoader();

        if (error) {
          Swal.fire('Error', 'Error al cargar el reporte: ' + error, 'error');
          return;
        }

        if (report) {
          this.createReports(report);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }

  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  createReports(report: ClubReportDTO): void {
    const transformedReservationsByDayOfWeek = {
      ...report.reservationsByDayOfWeek,
      labels: report.reservationsByDayOfWeek.labels.map((label: string) => {
        let translatedDay = '';
        switch (label.toLowerCase()) {
          case 'monday':
            translatedDay = 'lunes';
            break;
          case 'tuesday':
            translatedDay = 'martes';
            break;
          case 'wednesday':
            translatedDay = 'miércoles';
            break;
          case 'thursday':
            translatedDay = 'jueves';
            break;
          case 'friday':
            translatedDay = 'viernes';
            break;
          case 'saturday':
            translatedDay = 'sábado';
            break;
          case 'sunday':
            translatedDay = 'domingo';
            break;
          default:
            translatedDay = label; // Si no coincide, devuelve el día original
        }
        // Capitaliza la primera letra del día en español
        return translatedDay.charAt(0).toUpperCase() + translatedDay.slice(1);
      }),
    };

    this.updateChart(
      'reservationMadeByDay',
      'line',
      report.reservationsMadeByDay
    );
    this.updateChart(
      'reservationByDayOfWeek',
      'bar',
      transformedReservationsByDayOfWeek
    );

    this.updateChart('reservationByDay', 'line', report.reservationsByDay);

    this.updateChart('reservationByHour', 'bar', report.reservationsByHours);
    this.users = report.reservationsByUser;
  }

  updateChart(chartId: string, type: string, data: any) {
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Reservas',
          data: data.data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor:
            type === 'bar'
              ? ['#FF6384', '#36A2EB', '#FFCE56']
              : 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };

    if (this.charts[chartId]) {
      this.charts[chartId].data = chartData;
      this.charts[chartId].update();
    } else {
      this.charts[chartId] = new Chart(chartId, {
        type: type as ChartType,
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  generateReports() {
    if (!this.startDate || !this.endDate) {
      Swal.fire('Error', 'Por favor selecciona ambas fechas.', 'warning');
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      Swal.fire(
        'Error',
        'La fecha de inicio no puede ser posterior a la fecha de fin.',
        'warning'
      );
      return;
    }

    this.showLoader();
    this.store.dispatch(
      loadClubReport({ initialDate: this.startDate, endDate: this.endDate })
    );
  }

  destroyCharts(): void {
    const charts = [
      'reservationByHour',
      'reservationByDayOfWeek',
      'reservationMadeByDay',
    ];
    charts.forEach((chartId) => {
      const chart = Chart.getChart(chartId);
      if (chart) {
        chart.destroy();
      }
    });
  }

  showLoader(): void {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera mientras se cargan los datos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  dismissLoader(): void {
    Swal.close();
  }
}
