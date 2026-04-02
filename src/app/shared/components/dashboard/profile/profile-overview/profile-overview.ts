import { Component, input, signal, WritableSignal } from '@angular/core';
import { faFile, faHandshake, faSnowflake, faStar, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCashApp } from '@fortawesome/free-brands-svg-icons'
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
  
  public readonly icons: {[key: string]: IconDefinition} = {
    handshake: faHandshake,
    check: faCheck,
    file: faFile,
    cash: faCashApp,
    star: faStar,
    snowflake: faSnowflake
  }

  public readonly statistics: WritableSignal<StatCardData[]> = signal<StatCardData[]>([
    { label: 'Total Appointment', value: 255, todayCount: 15, icon: this.icons['handshake'], type: 'appointment' },
    { label: 'Done Appointment', value: 93, todayCount: 12, icon: this.icons['check'], type: 'appointment' },
    { label: 'Pending Appointment', value: 35, todayCount: 2, icon: this.icons['file'], type: 'appointment' },
    { label: 'Total Payment', value: 255, todayCount: 15, icon: this.icons['cash'], type: 'payment' },
    { label: 'Total Review', value: 220, todayCount: 5, icon: this.icons['star'], type: 'review' },
    { label: 'Generic', value: 156, todayCount: 7, icon: this.icons['snowflake'], type: 'generic' }
  ])
}
