import { Directive, ElementRef, HostListener, inject, output } from "@angular/core";

@Directive({
    selector: '[clickOutside]',
    standalone: true
})

export class ClickOutsideDirective {
    private elementRef = inject(ElementRef);
    clickOutside = output<void>();

    constructor() {}

    @HostListener('document:click', ['$event.target']) 
    public onClick(targetElement: EventTarget | null): void {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit();
        }
    }
}