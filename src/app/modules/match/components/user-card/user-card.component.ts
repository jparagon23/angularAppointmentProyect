import { Component, Input } from '@angular/core';

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
}
