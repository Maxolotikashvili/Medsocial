import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'mb-switch',
  imports: [],
  templateUrl: './mb-switch.html',
  styleUrl: './mb-switch.scss',
})
export class MbSwitch {
  public readonly color = input<'primary' | 'secondary' | 'tertiary'>('primary');
  public readonly disabled = input<boolean>(false);
  public readonly label1 = input<string>('');
  public readonly label2 = input<string>('');
  public readonly id = input<string>('');
  
  public readonly checked = model<boolean>(false);
  public readonly switchClass = computed(() => `mb-switch-container ${this.color()} ${this.disabled() ? 'disabled' : ''}`);

  public setToggle(value: boolean) {
    if (!this.disabled()) {
      this.checked.set(value);
    }
  }

  public onToggle(event: Event) {
    if (this.disabled()) return;
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
