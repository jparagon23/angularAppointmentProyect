import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ConversationItemComponent } from './components/conversation-item/conversation-item.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { MessageItemComponent } from './components/message-item/message-item.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { FormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ChatComponent,
    ConversationListComponent,
    ConversationItemComponent,
    ChatWindowComponent,
    MessageItemComponent,
    MessageInputComponent,
    ChatPageComponent,
  ],
  imports: [CommonModule, FormsModule, ChatRoutingModule, SharedModule],
})
export class ChatModule {}
