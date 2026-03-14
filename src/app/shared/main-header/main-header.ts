import { Component, HostListener, inject, signal } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../core/services/modal.service';
import { Effect } from '../directives/effect';
import { LoginModal } from '../modals/login-modal/login-modal';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'main-header',
  imports: [Effect, FaIconComponent],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  private modalService = inject(ModalService);
  private storageService = inject(StorageService);

  public isScrolled: boolean = false;
  public faUser = faUser;
  public readonly isUserSignedIn = signal(this.storageService.get('access_token'));

  @HostListener('window:scroll', []) onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  constructor() {}

  public openLoginModal() {
    this.modalService.open(LoginModal);
  }
}
