import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[effect]',
  standalone: true,
})
export class EffectDirective implements OnInit {
  @Input() effect: 'arrow' | 'none' = 'none';

  private host: HTMLElement = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);

  ngOnInit() {
    if (this.effect !== 'arrow') return;
    this.initiateArrowEffect();
  }

  private initiateArrowEffect() {
    this.renderer.addClass(this.host, 'effect-host-arrow');

    const wrapper = this.renderer.createElement('span');
    this.renderer.addClass(wrapper, 'effect-content-wrapper');

    while (this.host.firstChild) {
      this.renderer.appendChild(wrapper, this.host.firstChild);
    }

    const icon = this.renderer.createElement('span');
    this.renderer.addClass(icon, 'effect-icon-container');
    icon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="width: 1.3em; height: 1.3em;">
        <polyline points="5 18 11 12 5 6"></polyline>
        <polyline points="13 18 19 12 13 6"></polyline>
      </svg>
    `

    this.renderer.appendChild(this.host, icon);
    this.renderer.appendChild(this.host, wrapper);
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.effect === 'arrow') this.renderer.addClass(this.host, 'is-hovered');
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.effect === 'arrow') this.renderer.removeClass(this.host, 'is-hovered');
  }
}
