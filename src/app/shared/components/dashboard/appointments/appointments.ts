import { Component } from '@angular/core';
import { PaginatedResponse } from '../../../../core/models/procedures.model';
import { Consultation, ConsultationQuery } from '../../../../core/models/schedule.model';

@Component({
  selector: 'appointments',
  imports: [],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments {
  public appointments!: PaginatedResponse<Consultation>;
  public filters: ConsultationQuery = {}

  constructor() {}
}
