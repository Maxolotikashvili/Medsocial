import { Component, input, model, Self, Optional, signal, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'mb-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './mb-input.html',
  styleUrl: './mb-input.scss',
})
export class MbInput implements ControlValueAccessor {
  public readonly label = input<string | number>('');
  public readonly placeholder = input<string>('');
  public readonly type = input<'text' | 'password' | 'email' | 'date' | 'number'>('text');
  public readonly required = input<boolean>(false);
  public readonly errorMessage = input<string>('');
  public readonly id = input<string>(`mb-input-${Math.random().toString(36).substring(2, 9)}`);
  public readonly min = input<string | undefined>(undefined);
  public readonly max = input<string | undefined>(undefined);
  public readonly appearance = input<'outline' | 'underlined'>('underlined');

  public value = model<string | number | boolean>('');
  public isDisabled = signal<boolean>(false);

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public get isInvalid(): boolean {
    if (!this.ngControl) return false;
    return !!(this.ngControl.invalid && (this.ngControl.dirty || this.ngControl.touched));
  }

  public get currentErrorMessage(): string {
    const errors = this.ngControl?.errors;
    if (!errors) return '';

    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email';
    if (errors['alphaOnly']) return 'Numbers are not allowed';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['passwordMismatch']) return 'Passwords do not match';
    if (errors['futureDate']) return 'Are you from the future?';
    if (errors['unrealisticAge']) return 'Please enter a valid age';
    if (errors['invalidEmail']) return 'Please enter a valid email address (e.g. name@example.com)';
    if (errors['incompleteDate']) return 'Please enter full date (YYYY-MM-DD)';
    if (errors['invalidDate']) return 'Invalid date';
    if (errors['pattern']) return 'Only numbers are allowed';
    if (errors['serverError']) {
      return errors['serverError'];
    }

    return 'Invalid input';
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

  private onChange: (val: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(val: string): void {
    let finalValue: any = val || '';

    if (this.type() === 'date' && finalValue) {
      if (typeof finalValue === 'string' && finalValue.includes('T')) {
        finalValue = finalValue.split('T')[0];
      } else if (finalValue instanceof Date) {
        finalValue = finalValue.toISOString().split('T')[0];
      }
    }
    this.value.set(finalValue);
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
    const inputEl = event.target as HTMLInputElement;
    let val = inputEl.value;

    if (this.type() === 'date' && val.length < 10) {
      this.onChange(null);
      return;
    }

    this.value.set(val);
    this.onChange(val);
  }

  public handleBlur() {
    this.onTouched();
  }
}
