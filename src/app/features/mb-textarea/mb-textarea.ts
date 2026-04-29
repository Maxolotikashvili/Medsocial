import { Component, forwardRef, Input, input, InputSignal, Optional, Self, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'mb-textarea',
  imports: [],
  templateUrl: './mb-textarea.html',
  styleUrl: './mb-textarea.scss',
 
})
export class MbTextarea implements ControlValueAccessor {
  public allowAutoGrow: InputSignal<boolean> = input(false);
  public allowResize: InputSignal<'horizontal' | 'vertical' | 'both' | null> = input<'horizontal' | 'vertical' | 'both' | null>(null);
  public disabled: InputSignal<boolean> = input(false);
  public placeholder: InputSignal<string> = input('');
  public id: InputSignal<string | number> = input<string | number>(0);
  public name: InputSignal<string> = input('');

  public value = signal<string | null>('');
  public isDisabled = signal<boolean>(false);
  public errorText: WritableSignal<string> = signal('');

  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  get computedErrorText(): string {
    const control = this.ngControl?.control;

    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return 'Too short';
    if (control.errors['maxlength']) return 'Too long';
    if (control.errors['email']) return 'Invalid email format';

    return 'Invalid value';
  }

  get isInvalid(): boolean {
    const control = this.ngControl?.control;
    if (!control) return false;
    
    return control.invalid && (control.touched || control.dirty);
  }

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    this.value.set(value);
    this.onChange(value);

    if (this.allowAutoGrow()) {
      this.autoGrow(textarea);
    }
  }

  public onBlur(): void {
    this.onTouched();
  }

  private autoGrow(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
