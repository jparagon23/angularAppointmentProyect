import { Component, Input } from '@angular/core';
import { Message } from '../../models/Message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
})
export class MessageItemComponent {
  @Input() message!: Message;
  @Input() isOwnMessage: boolean = false;

  isToday(date: Date | string): boolean {
    const today = new Date();
    const d = new Date(date);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }
}
