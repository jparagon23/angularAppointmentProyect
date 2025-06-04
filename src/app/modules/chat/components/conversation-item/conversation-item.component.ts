import { Component, Input } from '@angular/core';
import { Conversation } from '../../models/Conversation.model';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
})
export class ConversationItemComponent {
  @Input() conversation!: Conversation;
  @Input() isSelected: boolean = false;

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
