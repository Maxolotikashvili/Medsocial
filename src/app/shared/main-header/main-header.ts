import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../core/services/modal.service';
import { EffectDirective } from '../directives/effect.directive';
import { LoginModal } from '../modals/login-modal/login-modal';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Authservice } from '../../core/services/auth.service';
import { RegisterModal } from '../modals/register-modal/register-modal';
import { ScrollFromTop } from "../directives/scroll-from-top.directive";

@Component({
  selector: 'main-header',
  imports: [EffectDirective, FaIconComponent, RouterLink, RouterLinkActive, ScrollFromTop],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  private modalService = inject(ModalService);
  private authService = inject(Authservice);
  public router = inject(Router);

  public isUserLoggedIn: WritableSignal<boolean> = signal<boolean>(this.authService.isLoggedIn());
  public isScrolled: WritableSignal<boolean> = signal<boolean>(false);
  public faUser: IconDefinition = faUser;
  public readonly isUserSignedIn: Signal<boolean> = this.authService.isLoggedIn;

  constructor() {}

  public changeIsScrolledState(state: boolean) {
    this.isScrolled.set(state);
  }

  public openLoginModal() {
    this.modalService.open(LoginModal);
  }

  public openRegisterModal() {
    this.modalService.open(RegisterModal);
  }
}
