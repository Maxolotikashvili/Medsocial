import { Component, input, output, signal, computed, model, WritableSignal, effect, Self, Optional, viewChild, ElementRef } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { ScrollToBottom } from "../../shared/directives/scroll-to-bottom.directive";
import { Loading } from '../loading/loading';
import { LowerCasePipe } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DropdownOption } from '../../core/models/dropdown.model';
import { detectValueMatch } from '../../shared/utilities/overlap-utility';
import { FilterItem } from '../../core/tokens/filter-injection-token';

@Component({
  selector: 'mb-dropdown',
  templateUrl: './mb-dropdown.html',
  styleUrl: './mb-dropdown.scss',
  standalone: true,
  providers: [{provide: FilterItem, useExisting: MbDropdown}],
  imports: [FaIconComponent, ClickOutsideDirective, ScrollToBottom, Loading, LowerCasePipe],
})
export class MbDropdown implements ControlValueAccessor {
  public isLoading = input<boolean>();
  public label = input.required<string>();
  public optionsList = input.required<DropdownOption[]>();
  public disabled = input<boolean>(false);
  public disableSearch = input<boolean>(false);
  
  public selectionChange = output<any>();
  public scrolledToBottom = output<void>();
  public searchValueChange = output<string>();
  public inputValue = model<DropdownOption>({value: ''}); 
  public params = model<{ q?: string } & Record<string, any>>({});
  
  public isOpen = signal(false);
  private _isFormControlDisabled = signal(false);
  public readonly isComponentDisabled = computed(() => this.disabled() || this._isFormControlDisabled());
  
  private searchInputValue: WritableSignal<string> = signal<string>('');
  private timeout: any;
  private searchInputEl = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  public icons: { [key: string]: IconDefinition } = {
    angleUp: faAngleUp,
    angleDown: faAngleDown,
  };

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      if (this.isOpen()) {
        requestAnimationFrame(() => {
          this.searchInputEl()?.nativeElement.focus();
        });
      }
    });
  }

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(val: string | DropdownOption): void {
    if (typeof val === 'object'){
      this.inputValue.set(val);
    } else {
      this.inputValue.set({value: val});
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._isFormControlDisabled.set(isDisabled); }

  public displayedLabel = computed(() => {
    const currentVal = this.inputValue()?.value;
    const selectedOption = this.optionsList().find(opt => opt.value === currentVal);

    return selectedOption ? selectedOption.value : this.label();
  });

  public displayedOptionsList = computed(() => {
    const selectedValue = this.inputValue()?.value;
    const placeholderLabel = this.label();
    const search = this.searchInputValue();

    let options = this.optionsList().filter((opt) => 
      opt.value !== selectedValue && opt.value !== placeholderLabel
    );

    const filtered = options.filter((option) => detectValueMatch(option.value, search))
    if (selectedValue !== '') {
      const resetOption: DropdownOption = { 
        value: this.label(),
        id: 'reset-option' 
      };
      return [...filtered, resetOption];
    }

    return filtered;
  });

  public showNoResults = computed(() => {
    const search = this.searchInputValue();
    const loading = this.isLoading();
    return !!search && !loading && this.displayedOptionsList().length === 0;
  });

  public toggleDropdown(state?: 'on' | 'off'): void {
    if (this.isComponentDisabled()) return;

    if (state === 'on') return this.isOpen.set(true);
    if (state === 'off') {
      this.searchInputValue.set('');
      return this.isOpen.set(false);
    }

    if (this.params()?.q) {
      this.searchValueChange.emit('');
    }

    this.isOpen.update((value) => {
      this.searchInputValue.set('');
      return !value;
    });
  }

  public selectOption(option: DropdownOption): void {
    const valueSet = option.value === this.label() ? {id: option.id, value: ''} : option;
    this.inputValue.set(valueSet);
    this.selectionChange.emit(valueSet);
    this.onChange(valueSet);
    this.onTouched();
    this.isOpen.set(false);
  }

  public onSearch(value: string): void {
    if (this.disableSearch()) return;
    
    this.searchInputValue.set(value);
    
    const hasLocalMatch = this.optionsList().some((option) => detectValueMatch(option.value, value));

    if (value === '' || !hasLocalMatch) {
      this.emiteSearchValueChangeWithDebounce(value);
    }
  }

  private emiteSearchValueChangeWithDebounce(value: string) {
    const debounceTime: number = 300;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchValueChange.emit(value);
    }, debounceTime); 
  }
}