import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../core/services/modal.service';
import { Effect } from '../directives/effect';
import { LoginModal } from '../modals/login-modal/login-modal';
import { StorageService } from '../../core/services/storage.service';
import { Router, RouterLink } from '@angular/router';
import { AUTH_CONFIG } from '../../core/configs/auth.config';

@Component({
  selector: 'main-header',
  imports: [Effect, FaIconComponent, RouterLink],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  private modalService = inject(ModalService);
  private storageService = inject(StorageService);
  public router = inject(Router);

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
}
