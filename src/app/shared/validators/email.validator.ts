import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailPatternValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = emailRegex.test(control.value);

  return valid ? null : { invalidEmail: true };
};