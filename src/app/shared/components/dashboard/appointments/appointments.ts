import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Consultation, ConsultationQuery } from '../../../../core/models/schedule.model';
import { useInfiniteData } from '../../../utilities/use-infinite-data.utility';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { CONSULTATION_STATUS } from '../../../../core/configs/schedule.config';
import { ButtonModule } from 'primeng/button';
import { TitleCasePipe } from '@angular/common';
import { ModalService } from '../../../../core/services/modal.service';
import { ConsultationModal } from '../../modals/consultation-modal/consultation-modal';
import { SmartDatePipe } from '../../../pipes/smart-date.pipe';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { map } from 'rxjs';

@Component({
  selector: 'appointments',
  imports: [ButtonModule, TitleCasePipe, SmartDatePipe, FaIconComponent],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Appointments {
  private scheduleService = inject(ScheduleService);
  private modalService = inject(ModalService);

  public icons: Record<string, IconDefinition> = {
    clock: faClock
  }

  public appointments = useInfiniteData(
    (params: ConsultationQuery, page: number) =>
      this.scheduleService.getConsultations({
        brief: params.brief,
        start_date: params.start_date,
        end_date: params.end_date,
        status: params.status,
        page: page,
      }).pipe(map((data) => ({
        ...data,
        results: [...data.results].reverse()
      }))),
  );

  public consultationStatus = CONSULTATION_STATUS;

  constructor() {}

  public viewConsultation(consultation: Consultation) {
    this.modalService.open(ConsultationModal, {modalData: consultation});
  }

  public updateAppointmentsQueryParams(query: ConsultationQuery) {}
}
