import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { Observable } from 'rxjs';
import {
  UserMatch,
  UserMatchResponse,
} from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-club-matches-section',
  templateUrl: './club-matches-section.component.html',
})
export class ClubMatchesSectionComponent implements OnInit {

  @Input() clubId: string | null = null;

  matches$: Observable<UserMatchResponse> = new Observable();
  matchesList: UserMatch[] = [];

  page: number = 0;
  size: number = 10;

  isLoading: boolean = true;


  constructor(private readonly matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }
  loadMatches(): void {
    this.isLoading = true;

    this.matches$ = this.matchService.getClubMatches(
      this.clubId ? Number(this.clubId) : undefined,
      'ALL',
      null,
      this.page,
      this.size,
      'match_date',
      'desc'
    );

    this.matches$.subscribe({
      next: (response: UserMatchResponse) => {
        this.matchesList = response._embedded?.matchResponseDTOList || [];
        this.isLoading = false;
      },
      error: () => {
        this.matchesList = [];
        this.isLoading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadMatches();

  }
}
