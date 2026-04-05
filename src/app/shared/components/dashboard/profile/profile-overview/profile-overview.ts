import { Component, input, signal, WritableSignal } from '@angular/core';
import { faSnowflake, faStar, IconDefinition, faClock, faCreditCard, faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Statcard } from "../../../../../features/statcard/statcard";
import { StatCardData } from '../../../../../core/models/statcard.model';

@Component({
  selector: 'profile-overview',
  imports: [Statcard],
  templateUrl: './profile-overview.html',
  styleUrl: './profile-overview.scss',
})
export class ProfileOverview {
  public user = input();
  
  public readonly icons: {
   appointment: IconDefinition,
   doneAppointment: IconDefinition,
   pendingAppoitment: IconDefinition,
   totalPayment: IconDefinition,
   totalReview: IconDefinition,
   generic: IconDefinition

  } = {
    appointment: faCalendarCheck,
    doneAppointment: faCheck,
    pendingAppoitment: faClock,
    totalPayment: faCreditCard,
    totalReview: faStar,
    generic: faSnowflake
  }

  public readonly statistics: WritableSignal<StatCardData[]> = signal<StatCardData[]>([
    { label: 'Total Appointment', value: 255, todayCount: 15, icon: this.icons.appointment, type: 'appointment' },
    { label: 'Done Appointment', value: 93, todayCount: 12, icon: this.icons.doneAppointment, type: 'appointment' },
    { label: 'Pending Appointment', value: 35, todayCount: 2, icon: this.icons.pendingAppoitment, type: 'appointment' },
    { label: 'Total Payment', value: 255, todayCount: 15, icon: this.icons.totalPayment, type: 'payment' },
    { label: 'Total Review', value: 220, todayCount: 5, icon: this.icons.totalReview, type: 'review' },
    { label: 'Generic', value: 156, todayCount: 7, icon: this.icons.generic, type: 'generic' }
  ])
}
