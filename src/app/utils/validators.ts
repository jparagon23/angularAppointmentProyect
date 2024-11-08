import { HttpResponse } from '@angular/common/http';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { EmailAvailabilityResponse } from '../models/EmailAvailabilityResponse.model';

export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }

  static checkIfEmailIsAvailable(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return authService.checkEmailAvailability(control.value).pipe(
        map((response: HttpResponse<EmailAvailabilityResponse>) => {
          return response.body?.creationResponse == 1 ||
            response.body?.creationResponse == 2
            ? { emailNotAvailable: true }
            : null;
        }),
        catchError(() => of({ emailCheckFailed: true }))
      );
    };
  }
}
