import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { cloneDeep, update } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import {
  CommonType,
  InitialSignUpData,
} from 'src/app/models/InitialSignUpData.interface';
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

  profileImage: string | null =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJElEQVR4nGNgoBUgAylIrYSk/D+5HIk+RJKo+Qmk/38IcVvgBhRdgAZMGWDPqDuwUl/gmGoQEGtHNiAAOAGkAx8PTEHOMkFYkHh2qCVrBBG3AU6DFYMCA4BjxQ/j1Ah/JhxV8oBRKaDFXH9ExxfwgVcwlJDZ4VAZojw3HwNITLO8AdUEgyVzo0h+4NgHLzRAaN0PGykWC6RDyB6YQdFsBLwC5+BVlGNhxQYlB1gHaQ/ImcUBmOPrgfFGAOACiIHLcAWUUfxMiFfQXZgBUUsD+wZhlI9NlMBBRLMwBaDshDGBSMhOEZhxUNgBRGhjE9NQNiBVJlP9GWYQAiI0hXw9IQss0RgFNFKhgdwGEGAOMDBAxiQoIUAAAAASUVORK5CYII=';

  public genders: CommonType[] = [
    { id: 'MALE', description: 'Masculino' },
    { id: 'FEMALE', description: 'Femenino' },
    { id: 'OTHER', description: 'Otro' },
  ];

  updateUserInfo$ = this.store.select(selectUpdateUserInfo);

  private readonly subscriptions = new Subscription();
  selectedFile: File | undefined;
  showMenu = false;

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

  onUploadButtonClick(event: MouseEvent) {
    if (this.userEditable.profileImage) {
      // Mostrar menú si ya hay imagen
      this.showMenu = !this.showMenu;
    } else {
      // Si no hay imagen, simular clic en el input de archivo
      const inputFile = document.getElementById('upload-photo') as HTMLElement;
      inputFile.click();
    }
    event.stopPropagation(); // Evita que se cierre el menú al hacer clic
  }

  onSelectPhoto() {
    this.showMenu = false;
    const inputFile = document.getElementById('upload-photo') as HTMLElement;
    inputFile.click();
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
        updatedData.name = this.userEditable.name;
      }
      if (this.originalUser.lastname !== this.userEditable.lastname) {
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
      if (this.originalUser.profileImage !== this.userEditable.profileImage) {
        updatedData.profileImage = this.userEditable.profileImage;
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

  getGenderDescription(genderId: string): string {
    const gender = this.genders.find((g) => g.id === genderId);
    return gender ? gender.description : 'No especificado';
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userEditable.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDeletePhoto() {
    this.userEditable.profileImage = null;
    this.showMenu = false;
  }
}
