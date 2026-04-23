import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { EffectDirective } from '../../../directives/effect.directive';
import { RegisterModal } from '../register-modal/register-modal';
import { ModalService } from '../../../../core/services/modal.service';
import { MbInput } from '../../../../features/mb-input/mb-input';
import { MbCheckbox } from '../../../../features/mb-checkbox/mb-checkbox';
import { Authservice } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Loading } from '../../../../features/loading/loading';
import { ErrorService } from '../../../../core/services/error.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'login-modal',
  imports: [MbCheckbox, MbInput, EffectDirective, Loading],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
})
export class LoginModal {
  private destroyRef = inject(DestroyRef);
  private modalService = inject(ModalService);
  private authService = inject(Authservice);
  private errorService = inject(ErrorService);

  public isLoading = signal<boolean>(false);
  public errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  public readonly isRememberMeChecked: boolean = false;
  public readonly emailValue: string = '';
  public readonly passwordValue: string = '';

  constructor() {}

  public openRegisterModal() {
    this.modalService.open(RegisterModal);
  }

  public loginUser(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);

    this.authService.login({ email: this.emailValue, password: this.passwordValue }).pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          location.reload();
          this.isLoading.set(false)
        },
        error: (err: HttpErrorResponse) => {
          this.errorService.handleError(err);
          this.errorMessage.set(this.errorService.errorMessage());
          this.isLoading.set(false);
        },
      });
  }
}
