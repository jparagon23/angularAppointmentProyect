import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LightUser } from 'src/app/models/LightUser.model';

@Component({
  selector: 'app-create-light-user-modal',
  templateUrl: './create-light-user-modal.component.html',
  styleUrls: ['./create-light-user-modal.component.css'],
})
export class CreateLightUserModalComponent {
  public userForm = this.fb.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    public dialogRef: MatDialogRef<CreateLightUserModalComponent>,
    private readonly fb: FormBuilder
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const user: LightUser = {
        name: this.userForm.value.name || '',
        lastName: this.userForm.value.lastName || '',
        email: this.userForm.value.email || '',
      };
      console.log('User created', user);
      this.dialogRef.close(user);
    }
  }
}
