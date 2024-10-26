import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvailableSlotInfo } from 'src/app/models/AvailableSlotInfo.model';

@Component({
  selector: 'app-available-slot-card',
  templateUrl: './available-slot-card.component.html',
})
export class AvailableSlotCardComponent {
  @Input() availableSlotInfo!: AvailableSlotInfo;
  @Output() slotSelected = new EventEmitter<boolean>();

  isChecked: boolean = false;

  onCheckboxChange(event: Event) {
    this.isChecked = (event.target as HTMLInputElement).checked;
    const isSelected = (event.target as HTMLInputElement).checked;
    this.slotSelected.emit(isSelected);
  }
}
