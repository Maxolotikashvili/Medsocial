import { Component, ElementRef, inject, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalService } from '../../core/services/modal.service';
import { ModalConfig } from '../../core/models/modal.model';

@Component({
  selector: 'app-modal-container',
  imports: [FaIconComponent],
  templateUrl: './modal-container.html',
  styleUrl: './modal-container.scss',
})
export class ModalContainer {
  @ViewChild('contentAnchor', { read: ViewContainerRef }) anchor!: ViewContainerRef;
  @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;

  private modalService = inject(ModalService);

  public xmark: IconDefinition = faXmark;

  constructor() {}

  public loadComponent<T>(component: Type<T>, config?: ModalConfig): void {
    const element = this.dialog.nativeElement;

    if (element.hasAttribute('open')) {
      const wrapper = element.querySelector('.modal-wrapper');
      wrapper?.classList.remove('modal-swapping');
      void (wrapper as HTMLElement).offsetWidth;
      wrapper?.classList.add('modal-swapping');
    }

    this.anchor.clear();
    const componentRef = this.anchor.createComponent(component);

    if (config?.modalData) {
      Object.assign(componentRef.instance!, {
        modalData: config.modalData,
      });
    }

    componentRef.changeDetectorRef.detectChanges();

    if (!element.hasAttribute('open')) {
      element.showModal();

      requestAnimationFrame(() => {
        // const active = document.activeElement as HTMLElement;
        // active?.blur();
      });
    }
  }

  public close() {
    this.modalService.close();
  }

  closeOnBackdrop(event: MouseEvent) {
    if (event.target === this.dialog.nativeElement) {
      this.close();
    }
  }
}
