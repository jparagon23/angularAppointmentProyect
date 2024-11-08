// import swal from 'sweetalert2';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AuthService } from 'src/app/services/auth.service';
import {
  CommonType,
  InitialSignUpData,
} from 'src/app/models/InitialSignUpData.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pre-register',
  templateUrl: './pre-register.component.html',
})
export class PreRegisterComponent {
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
    categoryId: ['', [Validators.required]],
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
    this.authService.getInitialSignUpData().subscribe({
      next: (data) => {
        this.initialData = data;
      },
      error: () => {},
    });
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

      this.authService.completePreRegisterUser(formData).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Usuario creado con exito');
          this.router.navigate(['login'], {
            queryParams: { email: response.email },
          });
        },
        error: (error) => {
          Swal.fire('Error', error.error.message[0], 'error');
        },
      });
    } else {
      console.error('documentType is null or undefined.');
    }
  }
}
