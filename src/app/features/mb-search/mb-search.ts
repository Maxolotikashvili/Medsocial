import { Component, forwardRef, input, InputSignal, output, signal, WritableSignal } from '@angular/core';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'mb-search',
  imports: [FaIconComponent, ClickOutsideDirective],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MbSearch), multi: true },],
  templateUrl: './mb-search.html',
  styleUrl: './mb-search.scss',
})
export class MbSearch implements ControlValueAccessor {
  public id: InputSignal<string | number> = input<string | number>(0);
  public placeholder: InputSignal<string> = input<string>('Search..');
  public label: InputSignal<string> = input<string>('');
  public disabled = signal(false);
  public isOpen: WritableSignal<boolean> = signal<boolean>(false);
  public searchSubmit = output<string>();

  public draftValue = signal<string>('');

  public faSearch: IconDefinition = faSearch;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {}

  writeValue(value: string): void {
    const val = value || '';
    this.draftValue.set(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onBlur() {
    this.onTouched();
  }
  
  public onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.draftValue.set(val);
  }

  private commitValue() {
    const value = this.draftValue();

    this.onChange(value);
    this.onTouched();
    
    this.searchSubmit.emit(value);
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.commitValue()
    }

    if (event.key === 'Escape') {
    }
  }
  public onSearchClick(state?: 'on' | 'off', input?: HTMLInputElement) {
    if (this.isOpen()) {
      this.commitValue();
    }

    if (input) {
      input.focus();
    }    

    if (state === 'on') return this.isOpen.set(true);
    if (state === 'off') return this.isOpen.set(false);

    return this.isOpen.set(!this.isOpen());
  }

}
