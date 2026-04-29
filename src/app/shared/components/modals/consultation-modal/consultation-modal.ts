import { Component, inject } from '@angular/core';
import { Consultation } from '../../../../core/models/schedule.model';
import { CONSULTATION_STATUS, SCHEDULE_SETTINGS } from '../../../../core/configs/schedule.config';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { UserService } from '../../../../core/services/user.service';
import { ScheduleService } from '../../../../core/services/schedule.service';

@Component({
  selector: 'consultation-modal',
  imports: [FaIconComponent, DatePipe, TitleCasePipe, Button],
  templateUrl: './consultation-modal.html',
  styleUrl: './consultation-modal.scss',
})
export class ConsultationModal {
  private userService = inject(UserService);
  private scheduleService = inject(ScheduleService);

  public modalData!: Consultation;
  public constultationStatus = CONSULTATION_STATUS;
  public user = this.userService.user();
  public meetingDuration: number = SCHEDULE_SETTINGS.interval;

  icons: Record<string, IconDefinition> = {
    date: faCalendar,
    time: faClock,
  };

  constructor() {}

  public handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'images/user-placeholder.png';
  }

  public acceptAppointment(appointment: Consultation) {
    console.log(appointment)
    // this.scheduleService.updateScheduleOverride({whId: '95de11e1-530b-467d-8dc3-0de670159771', body: {}});
  }
}
