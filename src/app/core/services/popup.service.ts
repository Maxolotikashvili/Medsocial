import { Injectable, signal} from '@angular/core';
import { PopupType } from '../models/popup.model';

@Injectable({ providedIn: 'root' })
export class PopupService {
  public isOpen = signal(false);
  public message = signal('');
  public type = signal<PopupType>('info');

  public show(message: string, type: PopupType = 'info') {
    this.message.set(message);
    this.type.set(type);
    this.isOpen.set(true);

    setTimeout(() => this.close(), 4000);
  }

  public close() {
    this.isOpen.set(false);
  }
}