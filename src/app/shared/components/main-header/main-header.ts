import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../../core/services/modal.service';
import { EffectDirective } from '../../directives/effect.directive';
import { LoginModal } from '../modals/login-modal/login-modal';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Authservice } from '../../../core/services/auth.service';
import { RegisterModal } from '../modals/register-modal/register-modal';
import { ScrollFromTop } from "../../directives/scroll-from-top.directive";
import { NotificationService } from '../../../core/services/notification.service';
import { take } from 'rxjs';;
import { Notification } from '../../../core/models/notifications.model';
import { Drawer } from "../../../features/drawer/drawer";
import { CalendarComponent } from "../../../features/calendar/calendar";

@Component({
  selector: 'main-header',
  imports: [EffectDirective, FaIconComponent, RouterLink, RouterLinkActive, ScrollFromTop, Drawer, CalendarComponent],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader implements OnInit {
  private modalService = inject(ModalService);
  private authService = inject(Authservice);
  private notificationsService = inject(NotificationService);
  public router = inject(Router);

  public isUserLoggedIn: Signal<boolean> = this.authService.isLoggedIn;
  public notificationsLength: WritableSignal<number> = signal(0);
  public isScrolled: WritableSignal<boolean> = signal<boolean>(false);
  public isCalendarOpened: WritableSignal<boolean> = signal(false);
  
  public faUser: IconDefinition = faUser;
  public calendar: IconDefinition = faCalendar

  constructor() {}

  ngOnInit(): void {
    this.getNotifications();
  }

  public changeIsScrolledState(state: boolean) {
    this.isScrolled.set(state);
  }

  public openLoginModal() {
    this.modalService.open(LoginModal);
  }

  public openRegisterModal() {
    this.modalService.open(RegisterModal);
  }

  private getNotifications() {
    if (this.isUserLoggedIn()) {
      this.notificationsService.getNotifications().pipe(take(1)).subscribe({
        next: (data) => {
          this.getNotificationsLength(data.results);
        }
      });
    }
  }

  private getNotificationsLength(data: Notification[]) {
    const unseenMessagesList = data.filter((ntfc) => ntfc.is_seen === false);
    this.notificationsLength.set(unseenMessagesList.length);
  }

  public openCalendar() {
    this.isCalendarOpened.set(!this.isCalendarOpened());
  }

  date1 = new Date("April 29, 2026 03:24:00");
  date2 = new Date("April 29, 2026 04:24:00");
}
