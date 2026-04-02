import { Component, computed, input, InputSignal, output, Signal } from '@angular/core';
import { Doctor } from '../../../../core/models/doctor.model';
import { faBriefcase, faBuildingColumns, faCalendarDays, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'professional-details-view',
  imports: [FaIconComponent, TitleCasePipe, DatePipe],
  templateUrl: './professional-details-view.html',
  styleUrl: './professional-details-view.scss',
})
export class ProfessionalDetailsView {
  public readonly data = input.required<Doctor['educations'] | Doctor['experiences']>();
  public readonly type = input.required<'education' | 'experience'| ''>();
  public readonly isEditable: InputSignal<boolean> = input<boolean>(false);
  public readonly editMode = output<void>();

  public icons: Record<string, IconDefinition> = {
    university: faBuildingColumns,
    calendar: faCalendarDays,
    briefcase: faBriefcase,
  };

  constructor() {}
}