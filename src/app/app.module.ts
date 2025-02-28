import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { ROOT_REDUCERS } from './state/app.state';
import { EffectsModule } from '@ngrx/effects';
import { ReservationEffects } from './state/effects/reservations.effects';
import { ProfileEffects } from './state/effects/users.effects';
import { AuthEffects } from './state/effects/auth.effects';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ClubEffects } from './state/effects/club.effects';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SharedModule } from './modules/shared/shared.module';
import { RedirectEffects } from './state/effects/redirect.effects';
import { RegisterEffects } from './state/effects/register.effects';
import { ClubConfigurationEffects } from './state/effects/clubConfiguration.effects';
import { ReportEffects } from './state/effects/report.effects';
import { EventEffects } from './state/effects/event.effects';
import { NotificationEffect } from './state/effects/notification.effects';
import { UserProfileEffects } from './state/user-profile/user-profile.effects';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    BrowserAnimationsModule,
    StoreDevtoolsModule.instrument({
      name: 'TEST',
      maxAge: 25, // Retiene los últimos 25 estados
      logOnly: environment.production, // Restringe el uso de DevTools en producción
      trace: true, // Habilita el rastreo de llamadas a acciones
      traceLimit: 25, // Opcional: limita el número de llamadas rastreadas
    }),
    EffectsModule.forRoot([
      ReservationEffects,
      ProfileEffects,
      AuthEffects,
      ClubEffects,
      RedirectEffects,
      RegisterEffects,
      ClubConfigurationEffects,
      ReportEffects,
      EventEffects,
      NotificationEffect,
      UserProfileEffects,
    ]),
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
