import { Component, OnInit } from '@angular/core';
import { Conversation } from '../../models/Conversation.model';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversationId: number | null = null;
  currentUserId!: number;
  screenIsMediumUp = false;
  isLoadingConversations = true;

  targetUserId: number | null = null;
  targetUserName: string | null = null;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private breakpointObserver: BreakpointObserver,
      private readonly route: ActivatedRoute,
      private readonly router: Router
  ) {
     this.breakpointObserver
    .observe(['(min-width: 768px)'])
    .subscribe(result => this.screenIsMediumUp = result.matches);
  }


  ngOnInit(): void {

    console.log("lanzando el oninit");
    
    
  const userId = this.authService.getUserId();
  if (userId === undefined) {
    throw new Error('Usuario no autenticado');
  }

  this.currentUserId = userId;

  // Capturar el targetUserId primero
  let targetUserId: number | null = null;

  this.route.queryParams
  .pipe(first()) // 👈 solo toma la primera vez
  .subscribe(params => {
    const userIdParam = +params['userId'];
    const userName = params['userName'];

    if (!isNaN(userIdParam)) {
      this.targetUserId = userIdParam;
      this.targetUserName = userName;
      this.loadConversations(undefined, this.targetUserId);
    } else {
      this.loadConversations();
    }
  });
}


  loadConversations(selectId?: number, targetUserId?: number | null): void {
    console.log("iniciamos con ",this.selectedConversationId);
    
  this.chatService.getUserConversations(this.currentUserId).subscribe({
    next: (conversations) => {
      this.conversations = conversations;
      this.isLoadingConversations = false;

      if (targetUserId) {
        const existingConversation = this.conversations.find(
          (c) => c.participantId === targetUserId
        );

        if (existingConversation) {
          console.log("Ya existe conversación con:", targetUserId);
          this.selectedConversationId = existingConversation.id;
          
        } else {
          console.log("No existe conversación, creando nueva");
          this.onNewConversation();
        }
      } else if (selectId && selectId !== 0) {
        this.selectedConversationId = selectId;
      } else if (
      this.selectedConversationId == 0 &&
        conversations.length > 0
      ) {
        this.selectedConversationId = conversations[0].id;
        console.log('Seleccionando conversación por defecto:', this.selectedConversationId);
      }
      this.clearRoute();
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
  const conversation = this.conversations.find(
    (c) => c.id === this.selectedConversationId
  );

  if (conversation) {
    return conversation.participantName;
  }

  return this.targetUserName ?? '';
}

getParticipantId(): number | null {
  // Si ya hay una conversación seleccionada, devuélvela
  const conversation = this.conversations.find(
    (c) => c.id === this.selectedConversationId
  );

  if (conversation) {
    return conversation.participantId;
  }


  // Si no hay conversación aún pero vino desde URL, usar ese ID
  return this.targetUserId ?? null;
}

  onNewConversation(): void {
    this.selectedConversationId = 0; // Valor especial para mostrar el buscador de nuevo chat
  }

  onNewMessageCreated(conversationId?: number): void {
    console.log("conversationId",conversationId);
    
    this.loadConversations(conversationId ,null);
  }

  clearRoute(){
    console.log("limpiando la ruta");
    
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {},
    replaceUrl: true
  });
  }
}
