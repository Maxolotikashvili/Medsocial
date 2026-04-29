import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { API_URL } from '../tokens/api-injection-token';
import { UserService } from './user.service';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { PaginatedResponse } from '../models/procedures.model';
import { API_ENDPOINTS } from '../configs/api-endpoints.config';
import { Notification } from '../models/notifications.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private userService = inject(UserService);
  private errorService = inject(ErrorService);

  private notificationsSignal: WritableSignal<PaginatedResponse<Notification> | null> = signal(null);
  public notifications = this.notificationsSignal.asReadonly();
  public unseenNotificationsLength: Signal<number> = computed(() => {
    const notifications = this.notificationsSignal();
    return (
      notifications?.results.filter(n => n.is_seen === false).length ?? 0
    )
  })
  public getNotifications(): Observable<PaginatedResponse<Notification>> {
    const user = this.userService.user();

    return this.http.get<PaginatedResponse<Notification>>(`${this.apiUrl}/${API_ENDPOINTS.USERS.NOTIFICATIONS(user.id)}`).pipe(
      tap((data) => this.notificationsSignal.set(data)),
      catchError((error) => {
        this.errorService.handleError(error);
        return EMPTY;
      })
    );
  }

  public updateNotifications(newNotification: Notification) {
    const notifications = this.notifications();
    const currentNotificationsList = this.notifications()?.results;
    const updatedNotificationsList = currentNotificationsList?.map(currentNotification => currentNotification.id === newNotification.id ? newNotification : currentNotification)
  
    this.notificationsSignal.set({
      count: notifications?.count!,
      previous: notifications?.previous!,
      next: notifications?.next!,
      results: updatedNotificationsList!
    });
  }
      
  public markNotificationsAsSeen(notificationId: Notification['id'], payload: { is_seen: boolean }): Observable<Notification> {
    const user = this.userService.user();

    return this.http.patch<Notification>(`${this.apiUrl}/${API_ENDPOINTS.USERS.NOTIFICATION(user.id, notificationId)}`, payload).pipe(
      catchError((error) => {
        this.errorService.handleError(error);
        return EMPTY;
      })
    );
  }
}
