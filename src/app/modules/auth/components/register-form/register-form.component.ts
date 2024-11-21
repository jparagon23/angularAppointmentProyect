import { CommonType } from './../../../../models/InitialSignUpData.interface';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { InitialSignUpData } from 'src/app/models/InitialSignUpData.interface';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment-timezone';
import { RequestStatus } from 'src/app/models/request-status.model';
import { CustomValidators } from 'src/app/utils/validators';
import { EmailAvailabilityResponse } from 'src/app/models/EmailAvailabilityResponse.model';
import { TERMS_AND_CONDITIONS } from 'src/app/modules/shared/constants/Constants.constants';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent implements OnInit {
  public formSubmitted = false;
  @Input() lightForm = false;
  public initialData!: InitialSignUpData;
  public genders: CommonType[] = [
    { id: 'MALE', description: 'Masculino' },
    { id: 'FEMALE', description: 'Femenino' },
    { id: 'OTHER', description: 'Otro' },
  ];
  public blurredFields: Set<string> = new Set<string>();
  @Input() showRegisterForm = false;
  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';

  formUser = this.fb.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });

  public registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    birthdate: ['', [Validators.required, this.birthdateValidator.bind(this)]],
    documentTypeId: ['', [Validators.required]],
    document: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(6),
        Validators.maxLength(10),
      ],
    ],
    phoneTypeId: ['', [Validators.required]],
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
    ],
    gender: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.email],
      [CustomValidators.checkIfEmailIsAvailable(this.authService)],
    ],
    categoryId: ['', [Validators.required]],
    roleId: 1,
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-+]).{8,}$/
        ),
      ],
    ],
    confirmationPassword: [
      '',
      [Validators.required, this.matchPassword.bind(this)],
    ],
    allowNotification: [''],
    agreeTerms: [false, [this.agreeTermsValidation.bind(this)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.lightForm) {
      // Eliminar los campos no necesarios en el formulario si lightForm es true
      (this.registerForm as any).removeControl('name');
      (this.registerForm as any).removeControl('lastname');
      (this.registerForm as any).removeControl('email');
      (this.registerForm as any).removeControl('roleId');
    }

    this.authService.getInitialSignUpData().subscribe({
      next: (data) => {
        this.initialData = data;
      },
      error: () => {},
    });
  }

  checkEmailAvailabe(): void {
    if (this.formUser.valid) {
      this.statusUser = 'loading';
      const { email } = this.formUser.getRawValue();
      this.authService.checkEmailAvailability(email).subscribe({
        next: (response: HttpResponse<EmailAvailabilityResponse>) => {
          this.statusUser = 'success';

          if (response.body?.creationResponse === 3) {
            this.registerForm.controls.email.setValue(email);
            this.showRegisterForm = true;
          } else if (response.body?.creationResponse === 1) {
            this.router.navigate(['/login'], {
              queryParams: { email },
            });
          } else if (response.body?.creationResponse === 2) {
            this.authService.setUserId(response.body.userId.toString());
            this.authService.resendAuthenticationCode().subscribe({
              next: () => {
                Swal.fire(
                  'El correo se encuentra pre-registrado',
                  'Se ha enviado un código de verificación a su correo electrónico',
                  'warning'
                ).then(() => {
                  this.router.navigate(['authAccount'], {
                    relativeTo: this.route,
                    queryParams: { 'pre-registered': true },
                  });
                });
              },
              error: () => {
                // Handle error if needed
                this.statusUser = 'failed';
              },
            });
          }
        },
        error: () => {
          // Handle error if needed
          this.statusUser = 'failed';
        },
      });
    } else {
      this.formUser.markAllAsTouched();
    }
  }

  agreeTermsValidation(control: AbstractControl): ValidationErrors | null {
    return control.value === true ? null : { invalidAgreeTerms: true };
  }

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const passwordControl = this.registerForm
      ? this.registerForm.get('password')
      : null;

    if (!passwordControl) {
      // Handle the case where 'password' control is not found
      return null;
    }

    return control.value === passwordControl.value
      ? null
      : { passwordMismatch: true };
  }

  birthdateValidator(control: AbstractControl): ValidationErrors | null {
    const today = moment().startOf('day');
    const birthdate = moment(control.value).startOf('day');

    const ageInYears = today.diff(birthdate, 'years');

    return ageInYears >= 5 ? null : { invalidBirthdate: true };
  }

  register(): void {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const documentTypeIdControl = this.registerForm.get('documentTypeId');
    const phoneTypeIdControl = this.registerForm.get('phoneTypeId');
    const phoneControl = this.registerForm.get('phone');
    const categoryControl = this.registerForm.get('categoryId');

    if (
      documentTypeIdControl?.value != null &&
      phoneTypeIdControl?.value != null &&
      phoneControl?.value != null &&
      categoryControl?.value != null
    ) {
      const formData = {
        ...this.registerForm.value,
        documentTypeId: +documentTypeIdControl.value,
        allowNotification: this.registerForm.get('allowNotification')!.value
          ? 'T'
          : 'F',
        phones: [
          {
            phoneTypeId: +phoneTypeIdControl.value,
            number: phoneControl.value,
          },
        ],
        categoryId: this.registerForm.get('categoryId')!.value,
        userClub: !this.lightForm ? 1 : undefined, // Only add userClub if lightForm is false
      };

      // Remove fields not needed
      delete formData.confirmationPassword;
      delete formData.phoneTypeId;

      // Select the appropriate service and response handling based on lightForm
      if (!this.lightForm) {
        this.authService.createUser(formData).subscribe({
          next: () => {
            this.router.navigate(['authAccount'], { relativeTo: this.route });
          },
          error: (error) => {
            Swal.fire('Error', error.error.message[0], 'error');
          },
        });
      } else {
        delete formData.name;
        delete formData.lastname;
        delete formData.email;
        delete formData.roleId;
        delete formData.userClub;
        this.authService.completePreRegisterUser(formData).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              text: 'Usuario creado con exito',
            });
            this.router.navigate(['login'], {
              queryParams: { email: response.email },
            });
          },
          error: (error) => {
            Swal.fire('Error', error.error.message[0], 'error');
          },
        });
      }
    } else {
      console.error('documentType is null or undefined.');
    }
  }

  openTermsModal(): void {
    Swal.fire({
      title: 'Términos y condiciones',
      html: TERMS_AND_CONDITIONS,
      showCloseButton: true,
      width: '600px', // Ajusta el ancho del modal según sea necesario
    });
  }
}
