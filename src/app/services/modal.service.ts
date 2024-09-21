import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: MatDialogRef<any>[] = [];

  add(modal: MatDialogRef<any>) {
    this.modals.push(modal);
  }

  remove(modal: MatDialogRef<any>) {
    this.modals = this.modals.filter((x) => x !== modal);
  }

  closeAllModals() {
    this.modals.forEach((modal) => modal.close());
    this.modals = []; // Limpiar la lista de modales después de cerrarlos
  }
}
