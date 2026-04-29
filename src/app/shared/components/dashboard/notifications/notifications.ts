import { Component, DestroyRef, effect, inject, OnInit, Signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { PaginatedResponse } from '../../../../core/models/procedures.model';
import { Notification } from '../../../../core/models/notifications.model';
import { ButtonModule } from 'primeng/button';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { SmartDatePipe } from '../../../pipes/smart-date.pipe';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../core/services/error.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollFromBreadcrumbDirective } from "../../../directives/scroll-from-breadcrumb.directive";

@Component({
  selector: 'notifications',
  imports: [ButtonModule, FaIconComponent, SmartDatePipe, ScrollFromBreadcrumbDirective],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private notificationsService = inject(NotificationService);
  private errorService = inject(ErrorService);
  private destroy$ = inject(DestroyRef)

  public icons: Record<string, IconDefinition> = {
    date: faClock
  }

  public notifications: Signal<PaginatedResponse<Notification> | null> = this.notificationsService.notifications;
  public unseenNotificationsLength: Signal<number> = this.notificationsService.unseenNotificationsLength;

  constructor() {
    effect(() => {
      this.notifications();
      setTimeout(() => {
        this.markAllNotificationsAsSeen();
      }, 1500);
    })
  }
  
  private markAllNotificationsAsSeen() {
    const unseenNotifications = this.notifications()?.results.filter(notification => !notification.is_seen);
    
    if (!unseenNotifications?.length) {
      return;
    }
    forkJoin(
      unseenNotifications.map(notification => this.notificationsService.markNotificationsAsSeen(notification.id, { is_seen: true }))
    ).pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: (res) => {  
        res.forEach((notification) => this.notificationsService.updateNotifications(notification));
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.handleError(error);
      }
    })
  }
}
