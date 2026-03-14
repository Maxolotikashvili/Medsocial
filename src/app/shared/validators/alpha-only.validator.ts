import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const alphaOnlyValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const nameRegexp = /^[a-zA-Z\s\-]*$/; 
  if (control.value && !nameRegexp.test(control.value)) {
    return { alphaOnly: true };
  }
  return null;
};