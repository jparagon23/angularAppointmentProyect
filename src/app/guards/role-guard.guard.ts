import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { map, filter, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { AppState } from 'src/app/state/app.state';
import { loadUser } from 'src/app/state/actions/users.actions';

let hasRedirected = false;

export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const url = state.url;

  return store.select(selectUser).pipe(
    take(1),
    switchMap((user) => {
      if (user) {
        if (
          !hasRedirected &&
          (url === '/' || url === '/home' || url === '/login')
        ) {
          hasRedirected = true;
          if (user.role === 2) {
            router.navigate(['home/admin']);
          } else {
            router.navigate(['home/user']);
          }
        }
        return of(true);
      } else {
        store.dispatch(loadUser());

        return store.select(selectUser).pipe(
          filter((u) => !!u),
          take(1),
          tap((u) => {
            if (
              !hasRedirected &&
              (url === '/' || url === '/home' || url === '/login')
            ) {
              hasRedirected = true;
              if (u!.role === 2) {
                router.navigate(['home/admin']);
              } else {
                router.navigate(['home/user']);
              }
            }
          }),
          map(() => true)
        );
      }
    })
  );
};
