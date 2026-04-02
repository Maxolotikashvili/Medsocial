import { Component, computed, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
import { Doctor } from '../../../core/models/doctor.model';
import { ProfessionalDetailsView } from './professional-details-view/professional-details-view';
import { ProfessionalDetailsEdit } from './professional-details-edit/professional-details-edit';

@Component({
  selector: 'professional-details',
  imports: [ProfessionalDetailsView, ProfessionalDetailsEdit],
  templateUrl: './professional-details.html',
  styleUrl: './professional-details.scss',
})
export class ProfessionalDetails {
  public readonly educations: InputSignal<Doctor['educations']> = input<Doctor['educations']>([]);
  public readonly experiences: InputSignal<Doctor['experiences']> = input<Doctor['experiences']>([]);
  public readonly isEditable: InputSignal<boolean> = input<boolean>(false);

  public isEditModeOn: WritableSignal<boolean> = signal<boolean>(false);

  public readonly data: Signal<Doctor['educations'] | Doctor['experiences']> = computed(() => {
   if (this.educations().length > 0) {
      return this.educations();
    } else if (this.experiences().length > 0) {
      return this.experiences();
    }
    return [];
  });

  public readonly type = computed(() => {
    if (this.educations().length > 0) {
      return 'education';
    } else if (this.experiences().length > 0) {
      return 'experience';
    }

    return '';
  })

  constructor() {}
}