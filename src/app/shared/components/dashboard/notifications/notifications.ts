import { Component, inject, Signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { PaginatedResponse } from '../../../../core/models/procedures.model';
import { Notification } from '../../../../core/models/notifications.model';

@Component({
  selector: 'notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private notificationsService = inject(NotificationService);

  public notifications: Signal<PaginatedResponse<Notification> | null> = this.notificationsService.notifications;
}
