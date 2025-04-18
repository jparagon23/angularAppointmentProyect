import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-match-pagination',
  templateUrl: './match-pagination.component.html',
})
export class MatchPaginationComponent {
  @Input() matches: UserMatch[] = [];
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  prevPage() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    this.pageChange.emit(this.currentPage + 1);
  }
}
