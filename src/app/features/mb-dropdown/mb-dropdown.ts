import { Component, input, output, signal, computed, model, WritableSignal, InputSignal, effect, Self, Optional, viewChild, ElementRef } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { FilterItem } from '../../core/tokens/filter-injection-token';
import { detectValueMatch } from '../../shared/utilities/overlap-utility';
import { ScrollToBottom } from "../../shared/directives/scroll-to-bottom.directive";
import { Loading } from '../loading/loading';
import { LowerCasePipe } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'mb-dropdown',
  templateUrl: './mb-dropdown.html',
  styleUrl: './mb-dropdown.scss',
  imports: [FaIconComponent, ClickOutsideDirective, ScrollToBottom, Loading, LowerCasePipe],
  providers: [{ provide: FilterItem, useExisting: MbDropdown }],
})
export class MbDropdown implements ControlValueAccessor {
  public isLoading = input<boolean>();
  public label = input.required<string>();
  public optionsList = input.required<(string | number)[]>();
  public disabled: InputSignal<boolean> = input<boolean>(false);
  private _isFormControlDisabled = signal(false)
  public readonly isComponentDisabled = computed(() => this.disabled() || this._isFormControlDisabled())
  
  public selectionChange = output<string | number>();
  public scrolledToBottom = output<void>();
  public searchValueChange = output<string>();
  public inputValue = model<string | number>('');
  public params = model<{ q?: string } & Record<string, any>>({});
  
  public isOpen = signal(false);
  public isResultFound: WritableSignal<boolean> = signal<boolean>(true);
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
        setTimeout(() => {
          this.searchInputEl()?.nativeElement.focus();
        }, 0);
      }
    })
  }

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};
  public writeValue(val: any): void {
    this.inputValue.set(val || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
      this._isFormControlDisabled.set(isDisabled);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public displayedLabel = computed(() => {
    return this.inputValue() || this.label();
  });

  public displayedOptionsList = computed(() => {
    const selected = this.inputValue();
    const label = this.label();
    const search = this.searchInputValue().toLowerCase();

    let options = this.optionsList().filter((opt) => opt !== selected && opt !== label);

    const filtered = options.filter((option) => detectValueMatch(option, search));

    if (selected && selected !== label) {
      return [...filtered, label];
    }

    return filtered;
  });

  public showNoResults = computed(() => {
    const search = this.searchInputValue();
    const loading = this.isLoading();
    const options = this.optionsList();
    return !!search && !loading && options.length === 0;
  });

  public toggleDropdown(state?: 'on' | 'off'): void {
    if (this.disabled()) {
      return;
    }

    if (state === 'on') {
      return this.isOpen.set(true);
    }
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

  public selectOption(option: string | number): void {
    const valueSet = option === this.label() ? '' : option;

    this.inputValue.set(valueSet)
    this.selectionChange.emit(valueSet);

    this.onChange(valueSet);
    this.onTouched();

    this.isOpen.set(false);
  }

  public onSearch(value: string): void {
    this.searchInputValue.set(value);
    const hasLocalMatch = this.optionsList().some((option) => detectValueMatch(option, value));

    if (value === '') {
      this.emiteSearchValueChangeWithDebounce(value);
    } else if (hasLocalMatch) {
      return;
    }

    this.emiteSearchValueChangeWithDebounce(value);
  }

  private emiteSearchValueChangeWithDebounce(value: string) {
    const debounceTime: number = 300;

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.searchValueChange.emit(value);
    }, debounceTime); 
  }
}
