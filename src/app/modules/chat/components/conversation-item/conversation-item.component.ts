import { Component, Input } from '@angular/core';
import { Conversation } from '../../models/Conversation.model';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
})
export class ConversationItemComponent {
  @Input() conversation!: Conversation;
  @Input() isSelected: boolean = false;
}
