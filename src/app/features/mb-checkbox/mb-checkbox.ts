import {
  Component,
  computed,
  forwardRef,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'mb-checkbox',
  imports: [],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MbCheckbox), multi: true }],
  templateUrl: './mb-checkbox.html',
  styleUrl: './mb-checkbox.scss',
})
export class MbCheckbox implements FormCheckboxControl, ControlValueAccessor {
  public readonly disabled = model<boolean>(false);
  public readonly checked: ModelSignal<boolean> = model(false);

  public readonly placeholder = input<string>('');
  public readonly label = input<string>('');
  public readonly id = input<string>('');

  containerClass = computed(() => ({
    'is-checked': this.checked(),
    'is-disabled': this.disabled(),
  }));

  constructor() {}

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value)
  }

  toggle() {
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }
}
