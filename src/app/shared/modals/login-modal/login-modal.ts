import { Component, inject, signal } from '@angular/core';
import { Effect } from '../../directives/effect';
import { RegisterModal } from '../register-modal/register-modal';
import { ModalService } from '../../../core/services/modal.service';
import { MbInput } from '../../../features/mb-input/mb-input';
import { MbCheckbox } from '../../../features/mb-checkbox/mb-checkbox';
import { Authservice } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Loading } from '../../../features/loading/loading';

@Component({
  selector: 'login-modal',
  imports: [MbCheckbox, MbInput, Effect, Loading],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
})
export class LoginModal {
  private modalService = inject(ModalService);
  private authService = inject(Authservice);

  public isRequestPending = signal<boolean>(false);
  public errorMessage = signal<string>('');
  public readonly isRememberMeChecked: boolean = false;
  public readonly emailValue: string = '';
  public readonly passwordValue: string = '';

  constructor() {}

  public openRegisterModal() {
    this.modalService.open(RegisterModal);
  }

  public loginUser(event: Event) {
    event.preventDefault();
    this.isRequestPending.set(true);

    this.authService.login({ email: this.emailValue, password: this.passwordValue }).subscribe({
        next: () => {
          this.isRequestPending.set(false); 
          location.reload()
        },
        error: (err: HttpErrorResponse) => this.handleLoginError(err)
      });
  }

  private handleLoginError(err: HttpErrorResponse) {
    this.isRequestPending.set(false);
    if (err.status < 500) {
      this.errorMessage.set(err.error.detail);
      setTimeout(() => {
        this.errorMessage.set('');
      }, 5000);
    } else {
      this.errorMessage.set(err.statusText);
    }
    console.error(err);
  }
}
