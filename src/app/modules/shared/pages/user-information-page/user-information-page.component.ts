import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { cloneDeep, update } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { InitialSignUpData } from 'src/app/models/InitialSignUpData.interface';
import { User } from 'src/app/models/user.model';
import { UserState } from 'src/app/models/user.state';
import { loadInitialSignUpData } from 'src/app/state/actions/register.actions';
import {
  resertUpdateUserStatus,
  updateUser,
} from 'src/app/state/actions/users.actions';
import { AppState } from 'src/app/state/app.state';
import { selectInitialSignUpData } from 'src/app/state/selectors/register.selectors';
import {
  selectUpdateUserInfo,
  selectUser,
} from 'src/app/state/selectors/users.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-information-page',
  templateUrl: './user-information-page.component.html',
})
export class UserInformationPageComponent implements OnInit {
  isEditing = false;
  user$: Observable<User | null>;
  initialData$: Observable<InitialSignUpData | null>;
  userEditable!: Partial<User>; // Copia mutable de user
  originalUser!: Partial<User>; // Copia mutable de user
  initialData!: InitialSignUpData;

  updateUserInfo$ = this.store.select(selectUpdateUserInfo);

  private readonly subscriptions = new Subscription();

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(selectUser);
    this.initialData$ = this.store.select(selectInitialSignUpData).pipe(
      filter((data) => data !== null),
      distinctUntilChanged()
    );
  }

  ngOnInit(): void {
    this.loadInitialData();

    // Asigna el valor de user a userEditable cuando user cambia
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.userEditable = cloneDeep({
        ...user,
        allowNotification: user!.allowNotification === 'T',
      });
      console.log('userEditable', this.userEditable);

      this.originalUser = { ...user }; // Crea una copia del objeto user
    });

    this.initialData$.subscribe((data) => {
      this.initialData = {
        documentTypes: data?.documentTypes || [],
        genders: data?.genders || [],
        phoneTypes: data?.phoneTypes || [],
        categories: data?.categories || [],
      };
    });

    this.subscriptions.add(
      this.updateUserInfo$.subscribe((response) => {
        this.isEditing = false;

        if (response.updateUserSuccess) {
          this.handleUpdateSuccess();
        }
        if (response.updateUserFailure) {
          this.handleUpdateFailure();
        }
      })
    );
  }

  private loadInitialData(): void {
    this.store.dispatch(loadInitialSignUpData());
  }

  private handleUpdateSuccess(): void {
    Swal.fire({
      icon: 'success',
      title: 'Información actualizada',
      text: 'Tu información ha sido actualizada exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    }).then(() => {
      this.store.dispatch(resertUpdateUserStatus());
    });
  }

  private handleUpdateFailure(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar la información. Inténtalo de nuevo.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    }).then(() => {
      this.store.dispatch(resertUpdateUserStatus());
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  cancel(): void {
    this.toggleEdit();
    this.userEditable = cloneDeep(this.originalUser);
  }

  onSubmit(): void {
    if (this.userEditable) {
      // Define un objeto para almacenar solo los campos modificados
      const updatedData: Partial<User> = {};

      // Compara cada campo para identificar cambios
      if (this.originalUser.name !== this.userEditable.name) {
        console.log('change name');

        updatedData.name = this.userEditable.name;
      }
      if (this.originalUser.lastname !== this.userEditable.lastname) {
        console.log('change lastname');

        updatedData.lastname = this.userEditable.lastname;
      }

      if (this.originalUser.birthdate !== this.userEditable.birthdate) {
        updatedData.birthdate = this.userEditable.birthdate;
      }
      if (
        JSON.stringify(this.originalUser.userPhones) !==
        JSON.stringify(this.userEditable.userPhones)
      ) {
        updatedData.userPhones = this.userEditable.userPhones;
      }

      if (this.originalUser.gender !== this.userEditable.gender) {
        updatedData.gender = this.userEditable.gender;
      }
      if (
        this.originalUser.allowNotification !==
        this.userEditable.allowNotification
      ) {
        updatedData.allowNotification = this.userEditable.allowNotification
          ? 'T'
          : 'F';
      }

      if (Object.keys(updatedData).length > 0) {
        this.store.dispatch(updateUser({ user: updatedData }));
      } else {
        this.isEditing = false;
        Swal.fire({
          icon: 'info',
          title: 'Información no actualizada',
          text: 'No se detectaron cambios en tu información.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        }).then(() => {
          this.store.dispatch(resertUpdateUserStatus());
        });
      }
    }
  }

  getIdentificationTypeDescription(
    documentTypeId: number | undefined,
    documentTypes: any[]
  ): string {
    if (!documentTypeId || !documentTypes) {
      return '';
    }
    const documentType = documentTypes.find(
      (type) => type.id === documentTypeId
    );
    return documentType ? documentType.description : '';
  }
}
