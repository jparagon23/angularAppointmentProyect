import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs';
import { loginSuccess } from '../actions/auth.actions';
import { loadUserSuccess } from '../actions/users.actions';
import { selectUser } from '../selectors/users.selectors';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';

@Injectable()
export class RedirectEffects {
  navigateBasedOnRole$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadUserSuccess), // Cuando se carga el usuario correctamente
        withLatestFrom(this.store.select(selectUser)), // Obtener el estado del usuario
        tap(([action, user]) => {
          if (user) {
            if (user.role === 2) {
              this.router.navigate(['admin/home']); // Redirigir según el rol
            } else {
              this.router.navigate(['home']);
            }
          }
        })
      ),
    { dispatch: false }
  );


  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {}
}
