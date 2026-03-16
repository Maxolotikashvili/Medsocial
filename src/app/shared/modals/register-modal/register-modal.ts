import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Effect } from '../../directives/effect';
import { InitialFocus } from '../../directives/initial-focus';
import { Loading } from '../../../features/loading/loading';
import { MbInput } from '../../../features/mb-input/mb-input';
import { Authservice } from '../../../core/services/auth.service';
import { PopupService } from '../../../core/services/popup.service';
import { ModalService } from '../../../core/services/modal.service';
import { alphaOnlyValidator } from '../../validators/alpha-only.validator';
import { emailPatternValidator } from '../../validators/email.validator';
import { ageValidator } from '../../validators/date-validator';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'register-modal',
  imports: [MbInput, ReactiveFormsModule, Effect, InitialFocus, Loading],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.scss',
})
export class RegisterModal {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(Authservice);
  private popupService = inject(PopupService);
  private modalService = inject(ModalService);
  
  public isRequestPending = signal(false);

  public readonly minBirthDate: string = formatDate(
    new Date().setFullYear(new Date().getFullYear() - 140),
    'yyyy-MM-dd',
    'en-US',
  );
  public readonly maxBirthDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en-us');

  public registerForm = this.fb.group(
    {
      firstName: ['', [Validators.required, alphaOnlyValidator]],
      lastName: ['', [Validators.required, alphaOnlyValidator]],
      email: ['', [Validators.required, Validators.email, emailPatternValidator]],
      dob: ['', [Validators.required, ageValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  constructor() {}

  public submitRegisterForm() {
    if (this.registerForm.valid) {
      const newUser: RegisterRequest = {
        first_name: this.registerForm.getRawValue().firstName,
        last_name: this.registerForm.getRawValue().lastName,
        dob: new Date(this.registerForm.getRawValue().dob).toISOString(),
        email: this.registerForm.getRawValue().email,
        password: this.registerForm.getRawValue().password,
        password1: this.registerForm.getRawValue().confirmPassword,
      };

      this.isRequestPending.set(true);

      this.authService.register(newUser).pipe(finalize(() => this.isRequestPending.set(false))).subscribe({
        next: (response) => {
          console.log(response)
          this.modalService.close();
          this.popupService.show('Registration successful', 'success');
        },

        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error) {
            const serverErrors = err.error;

            Object.keys(serverErrors).forEach((key) => {
              const control = this.registerForm.get(key);
              if (control) {
                control.setErrors({
                  serverError: serverErrors[key][0],
                });
                control.markAsTouched();
              }
            });
          } else {
            console.error('Something went wrong on the server:', err);
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
      return;
    }
  }
}
