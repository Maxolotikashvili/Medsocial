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
  public readonly educations: InputSignal<Doctor['educations'] | null> = input<Doctor['educations'] | null>(null);
  public readonly experiences: InputSignal<Doctor['experiences'] | null> = input<Doctor['experiences'] | null>(null);
  public readonly isEditable: InputSignal<boolean> = input<boolean>(false);
  
  public isEditModeOn: WritableSignal<boolean> = signal<boolean>(false);

  public readonly data: Signal<Doctor['educations'] | Doctor['experiences']> = computed(() => this.educations() ?? this.experiences() ?? []);
  public readonly type: Signal<'education' | 'experience'> = computed(() => this.educations() ? 'education' : 'experience');
}