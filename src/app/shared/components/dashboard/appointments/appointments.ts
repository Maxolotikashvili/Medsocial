import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register as registerSwiper} from 'swiper/element';

@Component({
  selector: 'app-appointments',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments {
  constructor() {
    registerSwiper();
  }
}