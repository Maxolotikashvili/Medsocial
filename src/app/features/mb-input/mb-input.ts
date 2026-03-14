import { Component, input, model, Self, Optional, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'mb-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mb-input.html',
  styleUrl: './mb-input.scss',
})
export class MbInput implements ControlValueAccessor {
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly type = input<'text' | 'password' | 'email' | 'date'>('text');
  public readonly required = input<boolean>(false);
  public readonly errorMessage = input<string>('');
  public readonly id = input<string>(`mb-input-${Math.random().toString(36).substring(2, 9)}`);
  public readonly min = input<string | undefined>(undefined);
  public readonly max = input<string | undefined>(undefined);

  public value = model<string>('');
  public isDisabled = signal<boolean>(false);

  public get isInvalid(): boolean {
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  public get currentErrorMessage(): string {
    const errors = this.ngControl?.errors;
    if (!errors || !this.isInvalid) return '';

    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email';
    if (errors['alphaOnly']) return 'Numbers are not allowed';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['passwordMismatch']) return 'Passwords do not match';
    if (errors['futureDate']) return 'Are you from the future?';
    if (errors['unrealisticAge']) return 'Please enter a valid age';
    if (errors['invalidEmail']) return 'Please enter a valid email address (e.g. name@example.com)';

    if (errors['serverError']) {
      return errors['serverError'];
    }

    return 'Invalid input';
  }

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public get hasError(): boolean {
    return !!(
      this.ngControl &&
      this.ngControl.invalid &&
      (this.ngControl.dirty || this.ngControl.touched)
    );
  }

  public get isRequired(): boolean {
    const hasRequiredValidator = this.ngControl?.control?.hasValidator(Validators.required);
    return hasRequiredValidator || this.required();
  }

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(val: string): void {
    this.value.set(val || '');
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public handleInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  public handleBlur() {
    this.onTouched();
  }
}
