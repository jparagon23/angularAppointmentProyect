import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() message: string = ''; // Mensaje fijo
  @Input() messages: string[] = []; // Lista de mensajes rotativos

  private index = 0;
  private intervalId: any;

  ngOnInit(): void {
    if (this.messages.length > 0) {
      this.message = this.messages[this.index];

      this.intervalId = setInterval(() => {
        this.index = (this.index + 1) % this.messages.length;
        this.message = this.messages[this.index];
      }, 5000); // Cambia cada 3 segundos
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}