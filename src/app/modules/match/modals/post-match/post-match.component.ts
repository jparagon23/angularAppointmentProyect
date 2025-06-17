import { CLUB_ADMIN_ROLE } from 'src/app/modules/shared/constants/Constants.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatchResultDto } from 'src/app/models/PostResult.model';
import { ClubMembership, User } from 'src/app/models/user.model';
import { UserListReturn } from 'src/app/models/UserListReturn.model';
import {
  publishMatchResult,
  resetPostScoreStatus,
} from 'src/app/state/actions/event.actions';
import { AppState } from 'src/app/state/app.state';
import { selectPostScoreStatus } from 'src/app/state/selectors/event.selectors';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { format, toZonedTime } from 'date-fns-tz';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-match',
  templateUrl: './post-match.component.html',
})
export class PostMatchComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  matchDate: string = '';

  winner: string | null = null;
  publishForClub: boolean | null = null;

  user$ = this.store.select(selectUser);
  status$ = this.store.select(selectPostScoreStatus);
  sharedClubs: { clubId: number; name: string }[] | [] = [];
  sharedClub: { clubId: number; name: string } | null = null;

  player1: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;
  player2: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;
  player3: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;
  player4: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;

  user: User | null = null;

  setResults: any;
  CLUB_ADMIN_ROLE = CLUB_ADMIN_ROLE;
  matchType: 'SINGLES' | 'DOUBLES' = 'SINGLES';

  today = new Date();
  bogotaTimeZone = 'America/Bogota';
  zonedDate = toZonedTime(this.today, this.bogotaTimeZone);
  formattedToday = format(this.zonedDate, 'yyyy-MM-dd', {
    timeZone: this.bogotaTimeZone,
  });

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
  private readonly router: Router, ) {}

  ngOnInit(): void {
    this.matchDate = this.formattedToday;
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.player1 = this.player1 = {
          id: Number(user!.id),
          name: user!.name.concat(' ', user!.lastname),
          image: user!.profileImage ?? '',
          clubMemberships: user!.userClubMemberships,
        };
        this.sharedClubs = this.getSharedApprovedClubs();
        this.handleClubPublishing();
      }
    });

    this.status$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ loading, success, failure }) => {
        if (loading) {
          Swal.fire({
            title: 'Publicando resultado...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        } else if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Resultado publicado!',
            text: 'El resultado se publicó correctamente.',
          }).then(()=> this.router.navigate(['home/user'])); // Cerrar modal tras éxito
        } else if (failure) {
          Swal.fire({
            icon: 'error',
            title: 'Error al publicar el resultado',
            text: 'Hubo un problema al publicar el resultado. Por favor, inténtalo de nuevo.',
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetPostScoreStatus());
  }

  removePlayer(playerIndex: number): void {
    if (playerIndex === 1) this.player1 = null;
    if (playerIndex === 2) this.player2 = null;
    if (playerIndex === 3) this.player3 = null;
    if (playerIndex === 4) this.player4 = null;
  }

  // Método para seleccionar un jugador
  onUserSelectedP2(player: UserListReturn | null): void {
    if (!player) {
      this.player2 = null;
      return;
    }
    this.player2 = {
      id: Number(player.userId),
      name: player.completeName,
      image: player.profileImage,
      clubMemberships: player.userClubMemberships,
    };
    this.sharedClubs = this.getSharedApprovedClubs();
    this.handleClubPublishing();
  }

  onUserSelectedP1(player: UserListReturn | null): void {
    if (!player) {
      this.player1 = null;
      return;
    }
    this.player1 = {
      id: Number(player.userId),
      name: player.completeName,
      image: player.profileImage,
      clubMemberships: player.userClubMemberships,
    };
    this.sharedClubs = this.getSharedApprovedClubs();
    this.handleClubPublishing();
  }

  onUserSelectedP3(player: UserListReturn | null): void {
    if (!player) {
      this.player3 = null;
      return;
    }
    this.player3 = {
      id: Number(player.userId),
      name: player.completeName,
      image: player.profileImage,
      clubMemberships: player.userClubMemberships,
    };
    this.sharedClubs = this.getSharedApprovedClubs();
    this.handleClubPublishing();
  }

  onUserSelectedP4(player: UserListReturn | null): void {
    if (!player) {
      this.player4 = null;
      return;
    }
    this.player4 = {
      id: Number(player.userId),
      name: player.completeName,
      image: player.profileImage,
      clubMemberships: player.userClubMemberships,
    };
    this.sharedClubs = this.getSharedApprovedClubs();
    this.handleClubPublishing();
  }

  handleResult(result: any): void {
    this.setResults = result;
    this.setResults.winner
      ? (this.winner = this.setResults.winner)
      : (this.winner = null);
  }

  updateWinnerIds(): void {
    if (!this.setResults || !this.setResults.sets) return;

    this.setResults.sets.forEach((set: any) => {
      if (set.winnerId === 'player1') {
        set.winnerId = this.player1?.id ?? 0;
        if (this.matchType === 'DOUBLES') {
          set.winnerId2 = this.player3?.id ?? 0;
        }
      } else if (set.winnerId === 'player2') {
        set.winnerId = this.player2?.id;
        if (this.matchType === 'DOUBLES') {
          set.winnerId2 = this.player4?.id ?? 0;
        }
      }
    });
  }

  publishResult(): void {
    if (!this.matchDate || isNaN(new Date(this.matchDate).getTime())) {
      Swal.fire('Error', 'Fecha inválida', 'error');
      return;
    }

    this.updateWinnerIds();
    const winnerId =
      this.setResults.winner === 'player1'
        ? this.player1?.id ?? 0
        : this.player2?.id ?? 0;
    const loserId =
      this.setResults.winner === 'player2'
        ? this.player1?.id ?? 0
        : this.player2?.id ?? 0;

    let winner2Id = null;
    let loser2Id = null;

    if (this.matchType === 'DOUBLES') {
      winner2Id =
        this.setResults.winner === 'player1'
          ? this.player3?.id ?? 0
          : this.player4?.id ?? 0;
      loser2Id =
        this.setResults.winner === 'player2'
          ? this.player3?.id ?? 0
          : this.player4?.id ?? 0;
    }

    const json: MatchResultDto = {
      winnerId: winnerId ?? 0,
      loserId: loserId ?? 0,
      winner2Id: winner2Id ?? null,
      loser2Id: loser2Id ?? null,
      matchType: this.matchType,
      matchDate: this.matchDate,
      sets: this.setResults.sets,
      groupId: null,
      clubId: this.sharedClub?.clubId ?? null,
    };

    this.store.dispatch(publishMatchResult({ matchResult: json }));
  }

  onDateChange(date: string): void {
    this.matchDate = date;
  }

  get canPublishResult(): boolean {
    return !!this.player1 && !!this.player2 && !!this.setResults?.winner;
  }

  selectMatchType(type: string): void {
    this.matchType = type as 'SINGLES' | 'DOUBLES';
  }

  private getSharedApprovedClubs(): { clubId: number; name: string }[] {
    const players = [this.player1, this.player2];
    if (this.matchType === 'DOUBLES') {
      if (!this.player3 || !this.player4) return [];
      players.push(this.player3, this.player4);
    }

    if (players.some((p) => !p?.clubMemberships)) return [];

    const clubLists = players.map((p) =>
      p!.clubMemberships
        .filter((m) => m.status === 'APPROVED' && m.club.allowMatchReporting)
        .map((m) => ({ clubId: m.club.id, name: m.club.name }))
    );

    // Intersección de todos los clubes
    return clubLists.reduce((acc, list) =>
      acc.filter((club) => list.some((c) => c.clubId === club.clubId))
    );
  }

  private handleClubPublishing(): void {
    const sharedClubs = this.getSharedApprovedClubs();

    if (sharedClubs.length === 1) {
      Swal.fire({
        icon: 'question',
        title: '¿Deseas publicar este partido por el club?',
        text: `Ambos jugadores pertenecen al club "${sharedClubs[0].name}".`,
        showCancelButton: true,
        confirmButtonText: 'Sí, publicar por el club',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.publishForClub = true;
          this.sharedClub = sharedClubs[0];
        } else {
          this.publishForClub = false;
        }
      });
    } else if (sharedClubs.length > 1) {
      Swal.fire({
        title: '¿Por cuál club deseas publicar el partido?',
        input: 'select',
        inputOptions: sharedClubs.reduce((acc, c) => {
          acc[c.clubId] = c.name;
          return acc;
        }, {} as Record<number, string>),
        inputPlaceholder: 'Selecciona un club',
        showCancelButton: true,
        inputValidator: (value) => {
          return !value ? 'Debes seleccionar un club' : null;
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const selectedClub = sharedClubs.find(
            (c) => c.clubId === +result.value
          );
          this.publishForClub = true;
          this.sharedClub = selectedClub ?? null;
        } else {
          this.publishForClub = false;
        }
      });
    } else {
      this.publishForClub = false;
      this.sharedClub = null;
    }
  }
}
