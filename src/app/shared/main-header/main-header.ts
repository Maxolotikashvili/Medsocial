import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../core/services/modal.service';
import { EffectDirective } from '../directives/effect.directive';
import { LoginModal } from '../modals/login-modal/login-modal';
import { StorageService } from '../../core/services/storage.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AUTH_CONFIG } from '../../core/configs/auth.config';
import { Authservice } from '../../core/services/auth.service';
import { RegisterModal } from '../modals/register-modal/register-modal';

@Component({
  selector: 'main-header',
  imports: [EffectDirective, FaIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  private modalService = inject(ModalService);
  private authService = inject(Authservice);
  private storageService = inject(StorageService);
  public router = inject(Router);
  
  public isUserLoggedIn: WritableSignal<boolean> = signal<boolean>(this.authService.isLoggedIn());
  public isScrolled: boolean = false;
  public faUser: IconDefinition = faUser;
  public readonly isUserSignedIn: WritableSignal<string | null> = signal(
    this.storageService.get(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
  );

  @HostListener('window:scroll', []) onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  constructor() {}

  public openLoginModal() {
    this.modalService.open(LoginModal);
  }

  public openRegisterModal() {
    this.modalService.open(RegisterModal);
  }
}
