import { Component, computed, forwardRef, input, model, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mb-switch',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MbSwitch),
      multi: true,
    },
  ],
  templateUrl: './mb-switch.html',
  styleUrl: './mb-switch.scss',
})
export class MbSwitch implements ControlValueAccessor {
  public readonly color = input<'primary' | 'secondary' | 'tertiary'>('primary');
  public readonly onLabel = input<string>('');
  public readonly offLabel = input<string>('');
  public readonly id = input<string>('');
  public readonly reversedLabels = input<boolean>(false);

  public checked: WritableSignal<boolean> = signal<boolean>(false);
  public disabled: boolean = false;

  public readonly switchClass = computed(() => `mb-switch-container ${this.color()} ${this.disabled ? 'disabled' : ''}`);

  constructor() {}

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public setToggle(value: boolean) {
    if (this.disabled) return;

    this.checked.set(value);
    this.onChange(value);
    this.onTouched();
  }

  public onToggle(event: Event) {
    if (this.disabled) return;

    const value = (event.target as HTMLInputElement).checked;
    
    this.checked.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
