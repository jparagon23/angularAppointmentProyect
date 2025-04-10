
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ClubInfo } from 'src/app/models/ClubInfo.model';
import { ClubMembership, User } from 'src/app/models/user.model';
import { ClubService } from 'src/app/services/club.service';
import { updateStoreUser } from 'src/app/state/actions/users.actions';
import {
  loadClubRanking,
  loadLast10ClubMatches,
} from 'src/app/state/club/club.actions';
import { selectClubPageInfo } from 'src/app/state/club/club.selectors';
import { selectDashboardState } from 'src/app/state/dashboard-state/dashboard.selectors';
import { selectMembershipClubs } from 'src/app/state/membership/membership.selectors';
import { selectRankingState } from 'src/app/state/selectors/event.selectors';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-club-page',
  templateUrl: './club-page.component.html',
})
export class ClubPageComponent implements OnInit, OnDestroy {
  clubInfo!: ClubInfo;
  selectGeneralRankingStatus$ = this.store.select(selectRankingState);
  selectDashboardState$ = this.store.select(selectDashboardState);

  selectClubPageInfo$ = this.store.select(selectClubPageInfo);

  selectUser$ = this.store.select(selectUser);
  selectMembershipClubs$ = this.store.select(selectMembershipClubs);

  isMember = false;
  pendingMemberRequest = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store<any>,
    private readonly clubService: ClubService,
    private readonly route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the ID from the URL
    const clubId = this.route.snapshot.paramMap.get('id');

    if (clubId) {
      this.loadClubData(parseInt(clubId, 10));
      this.store.dispatch(
        loadLast10ClubMatches({ clubId: parseInt(clubId, 10) })
      );
      this.store.dispatch(loadClubRanking({ clubId: parseInt(clubId, 10) }));
    }
  }

  private loadClubData(clubId: number): void {
    // Subscribe to membership clubs and find the club with the matching ID
    this.selectMembershipClubs$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clubs) => {
        const club = clubs.activeClubs.find((club) => club.id === clubId);
        if (club) {
          this.clubInfo = club;
          this.checkMembershipStatus();
        } else {
          // If the club is not found in store, fetch it from the service
          this.fetchClubInfo(clubId);
        }
      });
  }

  private fetchClubInfo(clubId: number): void {
    this.clubService.getClubById(clubId).subscribe((club) => {
      this.clubInfo = club;
      this.checkMembershipStatus();
    });
  }

  private checkMembershipStatus(): void {
    this.selectUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user?.userClubMemberships) {
        const membership = user.userClubMemberships.find((m) => {
          return m.club.id === this.clubInfo.id;
        });

        this.pendingMemberRequest = membership?.status === 'PENDING';
        this.isMember = membership?.status === 'APPROVED';
      }
    });
  }

  register(): void {
    this.showLoadingDialog('Procesando...', 'Estamos enviando tu solicitud.');

    this.clubService.subscribeToClub(this.clubInfo.id).subscribe({
      next: () => {
        Swal.close(); // Cierra el loader
        this.pendingMemberRequest = true;
        this.showSuccessMessage(
          'Solicitud enviada',
          'Tu solicitud está en revisión.'
        );

        this.selectUser$.pipe(first()).subscribe((user) => {
          if (user) {
            this.updateUserMembership(user, true);
          }
        });
      },
      error: () => {
        this.showErrorMessage('Error', 'No se pudo enviar la solicitud.');
      },
    });
  }

  unregister(): void {
    this.showConfirmationDialog(
      '¿Estás seguro?',
      'Vas a eliminar tu suscripción al club.'
    ).then((result) => {
      if (!result.isConfirmed) return;

      this.clubService.unsubscribeToClub(this.clubInfo.id).subscribe(() => {
        this.isMember = false;
        this.showSuccessMessage(
          'Eliminado',
          'Tu suscripción ha sido eliminada.'
        );

        this.selectUser$.pipe(first()).subscribe((user) => {
          if (user) {
            this.updateUserMembership(user, false);
          }
        });
      });
    });
  }

  // 🔹 Reusable Swal functions
  private showLoadingDialog(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  private showSuccessMessage(title: string, text: string): void {
    Swal.fire(title, text, 'success');
  }

  private showErrorMessage(title: string, text: string): void {
    Swal.fire(title, text, 'error');
  }

  private showConfirmationDialog(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  }

  // 🔹 Reusable user membership update
  private updateUserMembership(user: User, isRegistering: boolean): void {
    const updatedUser: User = isRegistering
      ? {
          ...user,
          userClubMemberships: [
            ...user.userClubMemberships,
            {
              club: {
                id: this.clubInfo.id,
                name: this.clubInfo.name,
                allowMatchReporting: this.clubInfo.allowUserPublications,
              },
              status: 'PENDING',
              registerDate: '',
            },
          ],
        }
      : {
          ...user,
          userClubMemberships: user.userClubMemberships.filter(
            (m: ClubMembership) => m.club.id !== this.clubInfo.id
          ),
        };

    this.store.dispatch(updateStoreUser({ user: updatedUser }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

