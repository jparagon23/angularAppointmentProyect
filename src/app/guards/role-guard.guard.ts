import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { map, filter, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { AppState } from 'src/app/state/app.state';
import { loadUser } from 'src/app/state/actions/users.actions';

export const roleGuard: CanActivateFn = () => {
  console.log('Role guard initialized');

  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    switchMap((user) => {
      console.log('User fetched from store:', user);
      if (user) {
        // Redirigir según el rol del usuario si ya está cargado
        if (user.role == 2) {
          console.log('User is admin, navigating to home/admin');
          router.navigate(['home/admin']);
        } else {
          console.log('User is not admin, navigating to home/user');
          router.navigate(['home/user']);
        }
        return of(true); // Asegurarse de que el observable devuelve un booleano
      } else {
        console.log('User not found in store, dispatching loadUser action');
        store.dispatch(loadUser());
        store
          .select(selectUser)
          .pipe(
            filter((user) => !!user),
            take(1)
          )
          .subscribe((user) => {
            console.log('User fetched after dispatch:', user);
            if (user!.role == 2) {
              console.log('User is admin, navigating to home/admin');
              router.navigate(['home/admin']);
            } else {
              console.log('User is not admin, navigating to home/user');
              router.navigate(['home/user']);
            }
          });

        // Cargar usuario si aún no está cargado
        return of(true);
      }
    })
  );
};
