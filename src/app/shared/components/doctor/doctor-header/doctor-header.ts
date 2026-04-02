import { Component, input, InputSignal } from '@angular/core';
import { Rating } from "../../rating/rating";
import { Doctor } from '../../../../core/models/doctor.model';
import { DobToAgePipePipe } from '../../../pipes/dob-to-age.pipe';
import { faCalendar, faEarth, faFileMedical, faIdCardClip, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'doctor-header',
  imports: [Rating, DobToAgePipePipe, FaIconComponent],
  templateUrl: './doctor-header.html',
  styleUrl: './doctor-header.scss',
})
export class DoctorHeader {
  public readonly doctor: InputSignal<Doctor> = input.required<Doctor>();

  public icons = {
    title: faIdCardClip,
    bio: faFileMedical,
    age: faCalendar,
    timezone: faEarth
  }

  constructor() {}

  public handleImageError(event: Event) {
    const image = event?.target as HTMLImageElement;

    image.src = 'images/doctor-placeholder.png';
  }
}
