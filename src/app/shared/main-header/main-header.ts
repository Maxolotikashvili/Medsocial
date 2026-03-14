import { Component, HostListener, inject } from '@angular/core';
import { Effect } from "../directives/effect";
import { ModalService } from '../../core/services/modal.service';
import { LoginModal } from '../login-modal/login-modal';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'main-header',
  imports: [Effect],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  private modalService = inject(ModalService);
  private userService = inject(UserService);

  public isScrolled: boolean = false;

  @HostListener('window:scroll', []) onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  public openLoginModal() {
    this.modalService.open(LoginModal);
  }

  test() {
    console.log(this.userService.currentUser());
  }
}
