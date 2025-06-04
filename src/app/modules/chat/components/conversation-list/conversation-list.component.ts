import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conversation } from '../../models/Conversation.model';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
})
export class ConversationListComponent {
  @Input() conversations: Conversation[] = [];
  @Input() selectedConversationId!: number | null;
  @Input() isLoadingConversations:boolean=true;
  @Output() conversationSelected = new EventEmitter<number>();

  @Output() newConversation = new EventEmitter<void>();

  startNewConversation(): void {
    this.newConversation.emit();
  }

  selectConversation(id: number): void {
    this.conversationSelected.emit(id);
  }
}
