import {
  CommonType,
  Gender,
} from './../../../../models/InitialSignUpData.interface';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import swal from 'sweetalert2';

import { InitialSignUpData } from 'src/app/models/InitialSignUpData.interface';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment-timezone';
import { RequestStatus } from 'src/app/models/request-status.model';
import { CustomValidators } from 'src/app/utils/validators';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent implements OnInit {
  public formSubmitted = false;
  public initialData!: InitialSignUpData;
  public genders: CommonType[] = [
    { id: 'MALE', description: 'Masculino' },
    { id: 'FEMALE', description: 'Femenino' },
    { id: 'OTHER', description: 'Otro' },
  ];
  public blurredFields: Set<string> = new Set<string>();
  showRegisterForm = false;
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
        Validators.minLength(10),
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
    roleId: 2,
    password: ['', [Validators.required]],
    confirmationPassword: [
      '',
      [Validators.required, this.matchPassword.bind(this)],
    ],
    allowNotification: [''],
    agreeTerms: [false, [this.agreeTermsValidation.bind(this)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
        next: (response: HttpResponse<boolean>) => {
          this.statusUser = 'success';

          if (response.body) {
            this.registerForm.controls.email.setValue(email);
            this.showRegisterForm = true;
          } else {
            this.router.navigate(['/login'], {
              queryParams: { email },
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
      };

      delete formData.confirmationPassword;
      delete formData.phoneTypeId;

      console.log('this is the data');
      console.log(formData);

      this.authService.createUser(formData).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['authAccount'], { relativeTo: this.route });
        },
        (error) => {
          swal.fire('Error', error.error.message[0], 'error');
        }
      );
    } else {
      console.error('documentType is null or undefined.');
    }
  }
}
