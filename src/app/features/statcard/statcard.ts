import { Component, Input } from '@angular/core';
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
  @Input({required: true}) data!: StatCardData;

  public readonly heartBeat = faHeartbeat

  constructor() {}
}
