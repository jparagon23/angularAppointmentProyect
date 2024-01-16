import { PhoneType } from './../../interfaces/InitialSignUpData.interface';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { InitialSignUpData } from 'src/app/interfaces/InitialSignUpData.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  public formSubmitted = false;

  public initialData!: InitialSignUpData;

  public registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      documentTypeId: ['', [Validators.required]],
      document: ['', [Validators.required]],
      phoneTypeId: ['', [Validators.required]], // Add phoneTypeId
      phone: ['', [Validators.required]], // Add phone
      gender: ['', [Validators.required]],
      email: ['', [Validators.required]],
      roleId: 2,
      password: ['', [Validators.required]],
      confirmationPassword: ['', [Validators.required]],
      allowNotification: [''],
      agreeTerms: [false],
    },
    { validators: this.passwordsMatchValidator }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authService.getInitialSignUpData().subscribe((data) => {
      this.initialData = data;
      console.log(this.initialData);
    });
  }

  parseToInt(value: any): number | null {
    return value !== null && value !== '' ? +value : null;
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmationPassword = control.get('confirmationPassword')?.value;

    // Check if passwords match
    return password === confirmationPassword
      ? null
      : { passwordsDoNotMatch: true };
  }

  createUser() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    // Obtener el valor del control documentType
    const documentTypeControl = this.registerForm.get('documentTypeId');
    const phoneTypeIdControl = this.registerForm.get('phoneTypeId');
    const phoneControl = this.registerForm.get('phone');

    if (
      documentTypeControl &&
      documentTypeControl.value !== null &&
      documentTypeControl.value !== undefined &&
      phoneTypeIdControl &&
      phoneTypeIdControl.value !== null &&
      phoneTypeIdControl.value !== undefined &&
      phoneControl &&
      phoneControl.value !== null &&
      phoneControl.value !== undefined
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

      // Luego, puedes enviar formData a tu servicio
      this.authService.createUser(formData).subscribe((response) => {
        console.log(response);
        this.router.navigate(['/authAccount']);
      });
    } else {
      // Handle el caso donde documentTypeValue es nulo o indefinido
      console.error('documentType es nulo o indefinido.');
    }
  }
}
