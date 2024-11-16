import { CustomError } from 'src/app/models/CustomError.model';

export const errorMessages: CustomError[] = [
  { type: 'required', description: 'El campo es requerido.' },
  {
    type: 'minlength',
    description: 'La longitud mínima es de ${requiredLength} dígitos.',
  },
  {
    type: 'maxlength',
    description: 'La longitud máxima es de ${requiredLength} dígitos.',
  },
  { type: 'pattern', description: 'Formato inválido.' },
  { type: 'passwordMismatch', description: 'Las contraseñas no coinciden.' },
  {
    type: 'emailNotAvailable',
    description: 'El correo electrónico ya está en uso.',
  },
  {
    type: 'invalidBirthdate',
    description: 'La edad mínima para registrarse es de 5 años.',
  },
  { type: 'passwordsDoNotMatch', description: 'Las contraseñas no coinciden.' },
  {
    type: 'emailAlreadyInUse',
    description: 'Ya existe un usuario con ese correo electrónico.',
  },
  {
    type: 'tokenNotValid',
    description: 'El código ingresado no es válido. Intenta de nuevo.',
  },
];
