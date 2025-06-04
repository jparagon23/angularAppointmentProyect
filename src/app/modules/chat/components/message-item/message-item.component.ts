import { Component, Input } from '@angular/core';
import { Message } from '../../models/Message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
})
export class MessageItemComponent {
  @Input() message!: Message;
  @Input() isOwnMessage: boolean = false;
}
