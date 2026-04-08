import { ChangeDetectionStrategy, Component, computed, contentChildren, effect, input, InputSignal, isDevMode, output, Signal, signal, WritableSignal } from '@angular/core';
import { FilterItem } from '../../../core/tokens/filter-injection-token';
import { shallowEqual } from '../../utilities/object-comparer-utility';
import { Filter } from '../../../core/models/filter.model';
import { DropdownOption } from '../../../core/models/dropdown.model';

@Component({
  selector: 'filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Filters {
  public layout: InputSignal<'vertical' | 'horizontal'> = input<'vertical' | 'horizontal'>('horizontal');
  public filterChange = output<Partial<Filter>>();

  private allFilters = contentChildren(FilterItem);

  public hasActiveFilters: Signal<boolean> = computed(() => {
    return this.allFilters().some((filter) => {
      const label = filter.label().toString().toLowerCase();
      if (label.includes('search')) return false;
      
      return filter.inputValue().value !== '';
    });
  });

  public hasChangesSinceLastSubmit = computed(() => {
  // const current: Record<string, string | number> = {};
  const current: Partial<Filter> = {};
 
  this.allFilters().forEach((item) => {
  //   const inputValue = item.inputValue().toString().toLowerCase();
  //   const label = item.label().toString().toLowerCase();

  //   current[item.label()] =
  //     label === inputValue || inputValue === '' ? '' : inputValue;
  
  const input = item.inputValue() as DropdownOption;
  current[item.label() as keyof Filter] = input;
});
  
  return !shallowEqual(current, this.lastEmittedValue());
});

  public isValueEmitted: WritableSignal<boolean> = signal<boolean>(false);
  private lastEmittedValue: WritableSignal<Partial<Filter>> = signal({});
  
  constructor() {
    effect(() => {
      this.handleErrorCases();
      this.resetCityDropdown();
      this.resetFiltersOnDefaultInput();
    });
  }
  
  private resetCityDropdown() {
    const countryFilter = this.allFilters().find((f) => f.label().toString().toLowerCase() === 'country');
    const cityFilter = this.allFilters().find((f) => f.label().toString().toLowerCase() === 'city');

    if (!countryFilter || !cityFilter) return;
    if (countryFilter.inputValue().value === '') {
      cityFilter.inputValue.set({value: ''});
    }
  }

  private resetFiltersOnDefaultInput() {
    if (this.allFilters().some((filter) => filter.inputValue().value !== '')) {
      return;
    } else {
      this.isValueEmitted.set(false);
    }
  }

  private handleErrorCases(): void {
    const labels = this.allFilters().map((item) => item.label());
    const uniqueLabels = new Set(labels);

    if (uniqueLabels.size !== labels.length) {
      const duplicates = labels.filter((item, index) => labels.indexOf(item) !== index);
      const errorMsg = `[Filters Error]: Duplicate labels detected: "${duplicates.join(', ')}". Each filter must have a unique [label].`;

      if (isDevMode()) {
        throw new Error(errorMsg);
      } else {
        console.error(errorMsg);
      }
    }
  }

  public submitFilters() {
    if (!this.hasActiveFilters() || !this.hasChangesSinceLastSubmit()) return;

    const results: Partial<Filter> = {};

    this.allFilters().forEach((item) => {
      const input = item.inputValue() as DropdownOption;
      const isResetState = input.value === '' || input.value === item.label();
      results[item.label() as keyof Filter] = isResetState ? {value: ''} : input;

      // const inputValue = item.inputValue() as DropdownOption;
      // const label = item.label().toString().toLowerCase() as keyof Filter;

      // results[item.label()] = label === inputValue.value || inputValue.value === '' ? '' : inputValue;
    });
    this.filterChange.emit(results);
    this.isValueEmitted.set(true);
    this.lastEmittedValue.set(results);
  }

  public resetFilters() {
    if (!this.isValueEmitted()) return;

    this.allFilters().forEach((filter) => {
      filter.inputValue.set({value: ''});
    });

    this.filterChange.emit({});
    this.isValueEmitted.set(false);
    this.lastEmittedValue.set({});
  }
}
