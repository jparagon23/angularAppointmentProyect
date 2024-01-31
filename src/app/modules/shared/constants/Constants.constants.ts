import { CustomError } from 'src/app/models/CustomError.model';

export const errorMessages: CustomError[] = [
  { type: 'required', description: 'This field is required.' },
  { type: 'minlength', description: 'Minimum length is ${requiredLength}.' },
  { type: 'maxlength', description: 'Maximum length is ${requiredLength}.' },
  { type: 'pattern', description: 'Invalid format.' },
  { type: 'passwordMismatch', description: 'The passwords dont match' },
  { type: 'emailNotAvailable', description: 'The emai is already in use' },
  {
    type: 'invalidBirthdate',
    description: 'The user must be at least 5 years old.',
  },
  { type: 'passwordsDoNotMatch', description: 'The passwords do not match.' },
  {
    type: 'emailAlreadyInUse',
    description: 'There is already a user with that email.',
  },
  {
    type: 'tokenNotValid',
    description: 'The code entered is not valid, please try again.',
  },
  // Add more error types as needed
];
