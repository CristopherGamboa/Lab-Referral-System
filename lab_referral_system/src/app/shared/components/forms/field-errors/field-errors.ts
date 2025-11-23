import { Component, computed, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-field-errors',
  imports: [],
  templateUrl: './field-errors.html'
})
export class FieldErrors {
  fieldErrors = input.required<ValidationError.WithField[] | null | undefined>();
  touched = input.required<boolean | undefined>();
  hasErrors = computed(() => {
    if (this.touched() != null && this.touched() 
      && this.fieldErrors() != null && this.fieldErrors())
      return true;
    else
      return false;
  });

  messages: { [key: string]: string } = {
    'required': 'Este campo es requerido',
    'minlength': 'El valor ingresado es demasiado corto',
    'maxlength': 'El valor ingresado es demasiado largo',
    'pattern': 'El valor no coincide con el patrón requerido',
    'email': 'El valor no coincide con un correo electrónico válido',
    'min': 'El valor ingresado es menor que el mínimo permitido',
    'max': 'El valor ingresado es mayor que el máximo permitido',
    'filetype': 'El archivo no tiene la extensión requerida',
    'filesize': 'El archivo es demasiado grande',
    'dateafter': 'La fecha final debe ser posterior a la inicial',
    'dateaftertoday': 'La fecha debe ser posterior a la actual',
    'passwordmismatch': 'Las contraseñas no coinciden',
    'minlengthpassword': 'La contraseña debe tener al menos 6 caracteres',
    'requiredpassword': 'La contraseña es requerida',
    'uppercasepassword': 'La contraseña debe contener al menos una mayúscula',
    'lowercasepassword': 'La contraseña debe contener al menos una minúscula',
    'digitpassword': 'La contraseña debe contener al menos un número',
    'nonalphanumericpassword': 'La contraseña debe contener al menos un caracter especial',
  };
}
