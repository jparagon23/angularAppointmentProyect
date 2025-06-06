import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<string>();
  messageText: string = '';

  onSend(): void {
    const text = this.messageText.trim();
    if (text) {
      this.send.emit(text);
      this.messageText = '';
    }
  }
}
