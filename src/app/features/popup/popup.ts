import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { PopupService } from '../../core/services/popup.service';

@Component({
  selector: 'popup',
  imports: [FaIconComponent],
  templateUrl: './popup.html',
  styleUrl: './popup.scss',
})
export class PopupComponent {
  protected popupService = inject(PopupService);
  
  public xmark: IconDefinition = faXmark;
}
