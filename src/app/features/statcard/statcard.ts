import { Component, input, Input, InputSignal } from '@angular/core';
import { StatCardData } from '../../core/models/statcard.model';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'statcard',
  imports: [FaIconComponent],
  templateUrl: './statcard.html',
  styleUrl: './statcard.scss',
})
export class Statcard {
  data: InputSignal<StatCardData> = input.required<StatCardData>();

  public readonly heartBeat = faHeartbeat

  constructor() {}
}
