import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  DOCUMENT,
  inject,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { ModalContainer } from '../../features/modal-container/modal-container';
import { ModalConfig } from '../models/modal.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);
  private document = inject(DOCUMENT);

  private containerRef?: ComponentRef<ModalContainer>;

  constructor() {}

  open<T>(component: Type<any>, config?: ModalConfig): void {
    if (!this.containerRef) {
      this.containerRef = createComponent(ModalContainer, {
        environmentInjector: this.appRef.injector,
        elementInjector: this.injector,
      });

      document.body.appendChild(this.containerRef.location.nativeElement);
      this.appRef.attachView(this.containerRef.hostView);
      this.containerRef.changeDetectorRef.detectChanges();
      this.document.body.classList.add('no-scroll');
    }

    this.containerRef.instance.loadComponent(component, config);
  }

  close(): void {
    if (this.containerRef) {
      this.appRef.detachView(this.containerRef.hostView);
      this.containerRef.destroy();
      this.containerRef = undefined;
      this.document.body.classList.remove('no-scroll');
    }
  }
}
