import { Component, input, InputSignal } from '@angular/core';
import { Rating } from "../../rating/rating";
import { Doctor } from '../../../../core/models/doctor.model';
import { DobToAgePipePipe } from '../../../pipes/dob-to-age.pipe';

@Component({
  selector: 'doctor-header',
  imports: [Rating, DobToAgePipePipe],
  templateUrl: './doctor-header.html',
  styleUrl: './doctor-header.scss',
})
export class DoctorHeader {
  public readonly doctor: InputSignal<Doctor> = input.required<Doctor>();

  public handleImageError(event: Event) {
    const image = event?.target as HTMLImageElement;

    image.src = 'images/doctor-placeholder.png';
  }
}
