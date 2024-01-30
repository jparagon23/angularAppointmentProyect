import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  Gender,
  InitialSignUpData,
} from 'src/app/models/InitialSignUpData.interface';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent implements OnInit {
  public formSubmitted = false;
  public initialData!: InitialSignUpData;
  public blurredFields: Set<string> = new Set<string>();

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
    email: ['', [Validators.required, Validators.email]],
    roleId: 2,
    password: ['', [Validators.required]],
    confirmationPassword: ['', [Validators.required]],
    allowNotification: [''],
    agreeTerms: [false, [this.agreeTermsValidation.bind(this)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
    const email = this.registerForm.get('email')?.value;

    if (email !== null && email !== undefined) {
      this.authService.checkEmailAvailability(email).subscribe(
        (response: HttpResponse<boolean>) => {
          const isAvailable = response.body;

          if (!isAvailable) {
            this.registerForm
              .get('email')
              ?.setErrors({ emailAlreadyInUse: true });
          }
        },
        (error) => {
          // Handle error if needed
          console.error(error);
        }
      );
    }
  }

  checkPasswordMatch(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmationPassword = this.registerForm.get(
      'confirmationPassword'
    )?.value;

    if (password !== confirmationPassword) {
      this.registerForm
        .get('confirmationPassword')
        ?.setErrors({ passwordsDoNotMatch: true });
    }
  }

  agreeTermsValidation(control: AbstractControl): ValidationErrors | null {
    return control.value === true ? null : { invalidAgreeTerms: true };
  }

  markAsBlurred(controlName: string): void {
    this.blurredFields.add(controlName);
  }

  birthdateValidator(control: AbstractControl): ValidationErrors | null {
    const today = moment().startOf('day');
    const birthdate = moment(control.value).startOf('day');

    const ageInYears = today.diff(birthdate, 'years');

    return ageInYears >= 5 ? null : { invalidBirthdate: true };
  }

  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control
      ? control.invalid &&
          (control.touched || this.blurredFields.has(controlName))
      : false;
  }

  parseToInt(value: any): number | null {
    return value !== null && value !== '' ? +value : null;
  }

  register(): void {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const documentTypeControl = this.registerForm.get('documentTypeId');
    const phoneTypeIdControl = this.registerForm.get('phoneTypeId');
    const phoneControl = this.registerForm.get('phone');

    if (
      documentTypeControl?.value != null &&
      phoneTypeIdControl?.value != null &&
      phoneControl?.value != null
    ) {
      const formData = {
        ...this.registerForm.value,
        documentType: +documentTypeControl.value,
        allowNotification: this.registerForm.get('allowNotification')!.value
          ? 'T'
          : 'F',
        phones: [
          {
            phoneTypeId: +phoneTypeIdControl.value,
            number: phoneControl.value,
          },
        ],
      };

      delete formData.confirmationPassword;

      this.authService.createUser(formData).subscribe((response) => {
        console.log(response);
        this.router.navigate(['/authAccount']);
      });
    } else {
      console.error('documentType is null or undefined.');
    }
  }
}
