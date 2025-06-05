import { UserListReturn } from './../../../../models/UserListReturn.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Message } from '../../models/Message.model';
import { ChatService } from '../../services/chat.service';
import Swal from 'sweetalert2';
import { Conversation } from '../../models/Conversation.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
})
export class ChatWindowComponent implements OnInit, OnChanges {
  @Input() conversationId!: number;
  @Input() participantName: string = '';
  @Input() currentUserId!: number;
  @Input() participantId: number | null = null;
  @Input() conversations: Conversation[] = [];

  @Output() newConversationStarted = new EventEmitter<number>();

  messages: Message[] = [];
  isLoadingMessages = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    if (this.conversationId && this.conversationId !== 0) {
      this.loadMessages();
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId'] && !changes['conversationId'].firstChange) {
      this.loadMessages();
    }
  }

 loadMessages(): void {
  this.isLoadingMessages = true; // 🟢 activa loader

  this.chatService
    .getMessagesBetweenUsers(this.conversationId)
    .pipe(finalize(() => (this.isLoadingMessages = false)))
    .subscribe((msgs) => {
      this.messages = msgs;
      this.scrollToBottom();
    });
}

  handleSend(content: string): void {
    if (!this.participantId) return;

    this.chatService
      .sendMessage({
        senderId: this.currentUserId,
        receiverId: this.participantId,
        content,
      })
      .subscribe((msg) => {
        this.messages.push(msg);
        this.scrollToBottom();

        if (this.conversationId === 0) {
          this.newConversationStarted.emit(); // notifica al padre para recargar
        }
      });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer)
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
    }, 100);
  }

  selectUser(userSelected: UserListReturn | null): void {
    if (!userSelected) return;

    const selectedUserId = Number(userSelected.userId);

    if (selectedUserId === this.currentUserId) {
      Swal.fire({
        icon: 'warning',
        title: 'Chat no permitido',
        text: 'No puedes iniciar un chat contigo mismo.',
        confirmButtonColor: '#418622',
      });
      return;
    }

    // 🔍 Validar si ya existe una conversación con ese usuario
    const existingConversation = this.conversations.find(
      (c) => c.participantId === selectedUserId
    );

    if (existingConversation) {
      Swal.fire({
        icon: 'info',
        title: 'Conversación existente',
        text: `Ya tienes un chat con ${userSelected.completeName}`,
        confirmButtonColor: '#418622',
      });
      console.log('Conversación existente:', existingConversation);

      // ✅ Emitir el ID de esa conversación al padre
      this.newConversationStarted.emit(existingConversation.id);
      console.log(
        'Emitiendo ID de conversación existente:',
        existingConversation.id
      );

      return;
    }

    // ✅ Nuevo chat
    this.participantName = userSelected.completeName;
    this.participantId = selectedUserId;
  }
}
