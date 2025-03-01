import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RankingInfo } from 'src/app/models/events/RankingInfo.model';
import { selectUser } from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
})
export class RankingTableComponent implements OnInit {
  @Input() ratings: RankingInfo[] = [];

  user$ = this.store.select(selectUser);
  isLoading = true;

  constructor(
    private readonly store: Store<any>,
    private readonly router: Router,
    private readonly route: ActivatedRoute // ⬅️ Importamos ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onRowClick(userId: number): void {
    // Detectamos si la URL actual tiene "admin" o "user"
    const path = this.route.snapshot.url.map((segment) => segment.path);
    const basePath = path.includes('admin') ? 'admin' : 'user';

    // Redirigir dinámicamente
    this.router.navigateByUrl(`/home/${basePath}/profile/${userId}`);
  }
}
