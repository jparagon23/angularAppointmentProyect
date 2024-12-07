import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {
  @Input() user: { name: string; image: string; index: number } = {
    name: '',
    image: '',
    index: 0,
  };
  @Input() winner: boolean = false;
  @Input() allowDelete: boolean = false;

  @Output() removeUser = new EventEmitter<number>();

  onRemoveClick(): void {
    this.removeUser.emit(this.user.index);
  }
}
