import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function createAgeValidator(userBirthDate: string | Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    const birthDate = new Date(userBirthDate);

    if (selectedDate > today) {
      return { futureDate: true };
    }

    if (selectedDate < birthDate) {
      return { unrealisticAge: true };
    }

    return null;
  };
}