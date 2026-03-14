import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword');

  if (!confirm) return null;

  if (password !== confirm.value && confirm.value.length > 0) {
    const error = { passwordMismatch: true };
    confirm.setErrors({ ...confirm.errors, ...error });
    return error;
  } else {
    if (confirm.errors) {
      const { passwordMismatch, ...rest } = confirm.errors;
      confirm.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  }
};