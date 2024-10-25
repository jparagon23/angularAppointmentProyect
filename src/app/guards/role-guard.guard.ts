import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { map, filter, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { AppState } from 'src/app/state/app.state';
import { loadUser } from 'src/app/state/actions/users.actions';

export const roleGuard: CanActivateFn = () => {
  console.log('Role guard');

  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    switchMap((user) => {
      if (user) {
        // Redirigir según el rol del usuario si ya está cargado
        if (user.role == 2) {
          router.navigate(['home/admin']);
        } else {
          router.navigate(['home/user']);
        }
        return of(true); // Asegurarse de que el observable devuelve un booleano
      } else {
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

        // Cargar usuario si aún no está cargado
        return of(true);
      }
    })
  );
};
