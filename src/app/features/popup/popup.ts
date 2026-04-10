import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { PopupService } from '../../core/services/popup.service';
import { PopupType } from '../../core/models/popup.model';

@Component({
  selector: 'popup',
  imports: [FaIconComponent],
  templateUrl: './popup.html',
  styleUrl: './popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent {
  private popupService = inject(PopupService);
  
  public popupType: Signal<PopupType> = this.popupService.type;
  public popupMessage: Signal<string> = this.popupService.message;
  public xmark: IconDefinition = faXmark;

  public closePopup() {
    this.popupService.close();
  }
}
