import { Injectable, signal} from '@angular/core';
import { PopupType } from '../models/popup.model';

@Injectable({ providedIn: 'root' })
export class PopupService {
  public isOpen = signal(false);
  public message = signal('');
  public type = signal<PopupType>('info');

  public show(params: {message: string, type: PopupType, timer?: number}) {
    this.message.set(params.message);
    this.type.set(params.type);
    this.isOpen.set(true);

    const timer = params.timer || 4000;

    setTimeout(() => {this.close()}, timer); 
  }

  public close() {
    this.isOpen.set(false);
  }
}