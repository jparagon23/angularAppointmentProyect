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
  { type: 'email', description: 'El correo electrónico no es válido.' }, // Añadido
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

export const TERMS_AND_CONDITIONS = `
  <div style="text-align: left; max-height: 400px; overflow-y: auto;">
    <h2><strong>Términos y Condiciones de Uso</strong></h2>
    <p><em>Última actualización: 21 de noviembre de 2024</em></p>
    <p>Estos Términos y Condiciones regulan el acceso y uso de la aplicación de gestión de reservas de canchas de tenis, <strong>Forehapp</strong> (en adelante, la "Aplicación"). Al utilizar la Aplicación, usted acepta los presentes términos y condiciones. Si no está de acuerdo con ellos, no utilice la Aplicación.</p>

    <h3>1. Definiciones</h3>
    <ul>
      <li><strong>Usuario:</strong> Cualquier persona que acceda o utilice la Aplicación.</li>
      <li><strong>Propietario:</strong> Forehapp.</li>
      <li><strong>Servicio:</strong> Funcionalidades proporcionadas por la Aplicación, incluyendo, pero no limitándose, a la gestión de reservas, suscripción a clubes, y comunicación de eventos.</li>
    </ul>

    <h3>2. Uso de la Aplicación</h3>
    <ul>
      <li>El Usuario se compromete a usar la Aplicación de manera legal y ética, respetando la legislación colombiana vigente.</li>
      <li>El Usuario debe proporcionar información veraz y actualizada durante el registro y uso de los servicios.</li>
      <li>Está prohibido el uso de la Aplicación para actividades fraudulentas, ilícitas o que puedan dañar los intereses de terceros o del Propietario.</li>
    </ul>

    <h3>3. Registro y Cuenta de Usuario</h3>
    <ul>
      <li>Para acceder a ciertos servicios, es necesario registrarse y crear una cuenta de Usuario.</li>
      <li>El Usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
      <li>Forehapp no se hace responsable por el uso no autorizado de las cuentas de los Usuarios.</li>
    </ul>

    <!-- Incluye el resto de las secciones aquí -->

    <h3>10. Contacto</h3>
    <p>Si tiene alguna pregunta sobre estos términos y condiciones, puede contactarnos a través de:</p>
    <ul>
      <li><strong>Correo electrónico:</strong> <a href="mailto:forehapp@gmail.com">forehapp@gmail.com</a></li>
    </ul>

    <p>Al aceptar estos términos, el Usuario reconoce que ha leído y entendido las condiciones, y que acepta cumplirlas en su totalidad.</p>
  </div>
`;
