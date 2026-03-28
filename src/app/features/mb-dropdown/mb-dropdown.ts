import { Component, input, output, signal, computed, model, WritableSignal, InputSignal, effect } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { FilterItem } from '../../core/tokens/filter-injection-token';
import { detectValueMatch } from '../../shared/utilities/overlap-utility';
import { ScrollToBottom } from "../../shared/directives/scroll-to-bottom.directive";
import { Loading } from '../loading/loading';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'mb-dropdown',
  templateUrl: './mb-dropdown.html',
  styleUrl: './mb-dropdown.scss',
  imports: [FaIconComponent, ClickOutsideDirective, ScrollToBottom, Loading, LowerCasePipe],
  providers: [{ provide: FilterItem, useExisting: MbDropdown }],
})
export class MbDropdown {
  public isLoading = input<boolean>();
  public label = input.required<string>();
  public optionsList = input.required<(string | number)[]>();
  public disabled: InputSignal<boolean> = input<boolean>(false);
  
  public selectionChange = output<string | number>();
  public scrolledToBottom = output<void>();
  public searchValueChange = output<string>();
  public inputValue = model<string | number>('');
  public params = model<{ q?: string } & Record<string, any>>({});
  
  public isOpen = signal(false);
  public isResultFound: WritableSignal<boolean> = signal<boolean>(true);
  private searchInputValue: WritableSignal<string> = signal<string>('');
  private timeout: any;

  public icons: { [key: string]: IconDefinition } = {
    angleUp: faAngleUp,
    angleDown: faAngleDown,
  };

  constructor() {}

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
    if (option === this.label()) {
      this.inputValue.set('');
      this.selectionChange.emit('');
    } else {
      this.inputValue.set(option);
      this.selectionChange.emit(option);
    }

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
