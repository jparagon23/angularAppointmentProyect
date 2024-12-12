import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-item.component.html',
})
export class NotificationItemComponent {
  @Input() notification!: NotificationItem;
  @Output() notificationClick = new EventEmitter<any>();

  onNotificationClick() {
    this.notificationClick.emit(this.notification); // Emitir los datos de la notificación
  }
}
