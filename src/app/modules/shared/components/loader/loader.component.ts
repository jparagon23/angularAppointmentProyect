import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() message: string = ''; // Mensaje fijo
  @Input() messages: string[] = []; // Lista de mensajes rotativos

  private shuffledMessages: string[] = [];
  private index = 0;
  private intervalId: any;

  ngOnInit(): void {
    if (this.messages.length > 0) {
      this.shuffleMessages();
      this.message = this.shuffledMessages[this.index];

      this.intervalId = setInterval(() => {
        this.index++;

        if (this.index >= this.shuffledMessages.length) {
          this.shuffleMessages(); // Vuelve a barajar al terminar
          this.index = 0;
        }

        this.message = this.shuffledMessages[this.index];
      }, 7000); // Cambia cada 5 segundos
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private shuffleMessages(): void {
    this.shuffledMessages = [...this.messages]; // Copia la lista original
    for (let i = this.shuffledMessages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledMessages[i], this.shuffledMessages[j]] = [
        this.shuffledMessages[j],
        this.shuffledMessages[i],
      ];
    }
  }
}
