import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { loginSuccess } from '../actions/auth.actions';

@Injectable()
export class RedirectEffects {
  navigateToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
