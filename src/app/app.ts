import { Component, inject, signal } from '@angular/core';
import { PopupService } from './core/services/popup.service';
import { PopupComponent } from './features/popup/popup';
import { MainHeader } from './shared/components/main-header/main-header';
import { RouterOutlet } from '@angular/router';
import { Breadcrumb } from "./shared/components/breadcrumb/breadcrumb";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainHeader, PopupComponent, Breadcrumb],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public readonly title = signal('medproject');
  private popupService = inject(PopupService);
  public isPopupOpen = this.popupService.isOpen;
}
