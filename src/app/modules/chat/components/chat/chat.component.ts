import { Component, OnInit } from '@angular/core';
import { Conversation } from '../../models/Conversation.model';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversationId: number | null = null;
  currentUserId!: number;
  screenIsMediumUp = false;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
     this.breakpointObserver
    .observe(['(min-width: 768px)'])
    .subscribe(result => this.screenIsMediumUp = result.matches);
  }

  

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId === undefined) {
      throw new Error('Usuario no autenticado');
    }

    this.currentUserId = userId;
    this.loadConversations();
  }

  loadConversations(selectId?: number): void {
    this.chatService.getUserConversations(this.currentUserId).subscribe({
      next: (conversations) => {
        this.conversations = conversations;

        // Si se recibió un ID a seleccionar, usarlo
        if (selectId && selectId !== 0) {
          this.selectedConversationId = selectId;
        }
        // Si no hay conversación seleccionada y hay conversaciones disponibles, seleccionar la primera
        else if (
          this.selectedConversationId != null &&
          conversations.length > 0
        ) {
          this.selectedConversationId = conversations[0].id;
          console.log(
            'Seleccionando conversación por defecto:',
            this.selectedConversationId
          );
        }
      },
      error: (error) => {
        console.error('Error al cargar las conversaciones:', error);
      },
    });
  }

  onSelectConversation(id: number): void {
    this.selectedConversationId = id;

    const conversation = this.conversations.find((c) => c.id === id);
    if (conversation && conversation.unreadCount > 0) {
      conversation.unreadCount = 0;
    }

    this.chatService.markAsRead(id).subscribe({
      next: () => {},
      error: (err) => console.error('Error marcando como leídos', err),
    });
  }

  getParticipantName(): string {
    return (
      this.conversations.find((c) => c.id === this.selectedConversationId)
        ?.participantName ?? ''
    );
  }

  getParticipantId(): number | null {
    return (
      this.conversations.find((c) => c.id === this.selectedConversationId)
        ?.participantId ?? null
    );
  }

  onNewConversation(): void {
    this.selectedConversationId = 0; // Valor especial para mostrar el buscador de nuevo chat
  }

  onNewMessageCreated(conversationId?: number): void {
    this.loadConversations(conversationId);
  }
}
