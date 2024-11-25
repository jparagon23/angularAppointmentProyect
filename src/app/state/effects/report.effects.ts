import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  loadClubReport,
  loadClubReportFailure,
  loadClubReportSuccess,
} from '../actions/report.actions';
import { ReportService } from 'src/app/services/report.service';

@Injectable()
export class ReportEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly reportService: ReportService
  ) {}

  loadClubReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadClubReport),
      switchMap(({ initialDate, endDate }) =>
        this.reportService.getClubReports(initialDate, endDate).pipe(
          map((report) => loadClubReportSuccess({ report })),
          catchError((error) => of(loadClubReportFailure({ error })))
        )
      )
    )
  );
}
