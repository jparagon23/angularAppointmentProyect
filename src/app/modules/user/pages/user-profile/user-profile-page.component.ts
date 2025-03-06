import { DatePipe } from '@angular/common';
import { es } from 'date-fns/locale';
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { format } from 'date-fns-tz';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { AppState } from 'src/app/state/app.state';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import {
  loadUserProfile,
  loadUserProfileMatches,
  loadUserProfileStats,
  resetUserProfileState,
} from 'src/app/state/user-profile/user-profile.actions';
import { selectUserProfileStatus } from 'src/app/state/user-profile/user-profile.selectors';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile-page.component.html',
})
export class UserProfileComponent implements OnInit, OnChanges, OnDestroy {
  selectedTab: string = 'matches';
  userId!: number;
  userApp$ = this.store.select(selectUser);
  matchType: string = 'SINGLES';
  showEditButton: boolean = false;
  initialDateParsed!: Date;
  formattedLastMatchDate: string = '';
  formattedLastDoublesMatchDate: string = '';

  userMatches: UserMatch[] = []; // Variable para almacenar los datos del perfil

  userProfile$ = this.store.select(selectUserProfileStatus);
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = Number(params.get('id'));
      this.loadUserData();

      // Asegura que la página comience desde arriba
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });

    // Comparar userApp con userId
    this.userApp$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.showEditButton = user?.id === this.userId;
    });

    // Suscribirse a userProfile$ y formatear la fecha
    this.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userProfile) => {
        const lastMatchDate = userProfile?.userProfile?.lastMatchConfirmed;
        const lastDoubleMatchDate =
          userProfile?.userProfile?.lastDoubleMatchConfirmed;

        if (lastMatchDate) {
          const parsedDate = new Date(lastMatchDate);
          this.formattedLastMatchDate = format(parsedDate, 'MMMM yyyy', {
            locale: es,
            timeZone: 'America/Bogota',
          });
        }
        if (lastDoubleMatchDate) {
          const parsedDate = new Date(lastDoubleMatchDate);
          this.formattedLastDoublesMatchDate = format(parsedDate, 'MMMM yyyy', {
            locale: es,
            timeZone: 'America/Bogota',
          });
        }

        this.userMatches = userProfile?.userMatches ?? [];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matchType'] && !changes['matchType'].firstChange) {
      this.store.dispatch(resetUserProfileState());
      this.store.dispatch(
        loadUserProfileStats({ id: this.userId, matchType: this.matchType })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetUserProfileState());
  }

  private loadUserData(): void {
    this.store.dispatch(loadUserProfile({ id: this.userId }));
    this.store.dispatch(loadUserProfileMatches({ id: this.userId }));
    this.store.dispatch(
      loadUserProfileStats({ id: this.userId, matchType: this.matchType })
    );
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  selectMatchTab(tab: string): void {
    this.matchType = tab;
    this.store.dispatch(
      loadUserProfileStats({ id: this.userId, matchType: this.matchType })
    );
  }

  redirectToUserInformation(): void {
    console.log('Redirecting to user information');

    // Detectamos si la URL actual tiene "admin" o "user"
    const path = this.route.snapshot.url.map((segment) => segment.path);
    const basePath = path.includes('admin') ? 'admin' : 'user';

    // Redirigir dinámicamente
    this.router.navigateByUrl(`/home/${basePath}/user-information`);
  }

  // ✅ Getter para los partidos confirmados
  get confirmedMatches() {
    return this.userMatches
      ? this.userMatches.filter((match) => match.status === 'CONFIRMED') || []
      : [];
  }
}
