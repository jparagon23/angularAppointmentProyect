import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { map, filter, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { AppState } from 'src/app/state/app.state';
import { loadUser } from 'src/app/state/actions/users.actions';

let hasRedirected = false;

export const roleGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    switchMap((user) => {
      if (user) {
        if (!hasRedirected) {
          hasRedirected = true; // Evita redirecciones adicionales
          if (user.role == 2) {
            console.log('User is admin, navigating to home/admin');
            router.navigate(['home/admin']);
          } else {
            console.log('User is not admin, navigating to home/user');
            router.navigate(['home/user']);
          }
        }
        return of(true);
      } else {
        console.log('User is not loaded, loading user');
        store.dispatch(loadUser());
        store
          .select(selectUser)
          .pipe(
            filter((user) => !!user),
            take(1)
          )
          .subscribe((user) => {
            if (user!.role == 2) {
              router.navigate(['home/admin']);
            } else {
              router.navigate(['home/user']);
            }
          });
        return of(true);
      }
    })
  );
};
