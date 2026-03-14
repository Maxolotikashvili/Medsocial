import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const ageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const selectedDate = new Date(control.value);
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 140); 

  if (selectedDate > today) {
    return { futureDate: true };
  }

  if (selectedDate < minDate) {
    return { unrealisticAge: true };
  }

  return null;
};