import { Component, computed, input, InputSignal, InputSignalWithTransform, model, ModelSignal } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'mb-checkbox',
  imports: [],
  templateUrl: './mb-checkbox.html',
  styleUrl: './mb-checkbox.scss',
})
export class MbCheckbox implements FormCheckboxControl {
  public readonly disabled = input<boolean>(false);
  public readonly checked: ModelSignal<boolean> = model(false);

  public readonly placeholder = input<string>('');
  public readonly label = input<string>('');
  public readonly id = input<string>('');

  containerClass = computed(() => ({
    'is-checked': this.checked(),
    'is-disabled': this.disabled()
  }))

  constructor() {}

  onCheckChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked.set(isChecked);
  }
}
