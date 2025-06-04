import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { map, filter, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { AppState } from 'src/app/state/app.state';
import { loadUser } from 'src/app/state/actions/users.actions';


export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const url = state.url;
  console.log("inicie el roleguard");
  
  return store.select(selectUser).pipe(
    take(1),
    switchMap((user) => {
      if (user) {
        console.log("entre al if user");
        
        if (
          (url === '/' || url === '/home' || url === '/login')
        ) {
          console.log("entre por el primero");
          
          if (user.role === 2) {
            console.log("soy un admin");
            
            router.navigate(['home/admin']);
          } else {
            console.log("soy un user");
            
            router.navigate(['home/user']);
          }
        }
        return of(true);
      } else {
        console.log("entre por el else user");
        
        store.dispatch(loadUser());

        return store.select(selectUser).pipe(
          filter((u) => !!u),
          take(1),
          tap((u) => {
            console.log("entre a este if despues");
            
            
            if (
              (url === '/' || url === '/home' || url === '/login')
            ) {
              console.log("entre al hasredirect");
              
              if (u!.role === 2) {
                console.log("soy un  admin 2");
                
                router.navigate(['home/admin']);
              } else {
                console.log("soy un  user1");
                
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
