import { Component, contentChildren, effect, input, InputSignal, isDevMode, output } from '@angular/core';
import { FilterItem } from '../../core/tokens/filter-injection-token';

@Component({
  selector: 'filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  public layout: InputSignal<'vertical' | 'horizontal'> = input<'vertical' | 'horizontal'>('horizontal'); 
  public buttonColor: InputSignal<'green' | 'blue' | 'black' | 'white'> = input<'green' | 'blue' | 'black' | 'white'>('blue');
  public filterChange = output<Record<string, string | number>>();
  
  private allFilters = contentChildren(FilterItem);

  constructor() {
    effect(() => {
      this.handleErrorCases();
    });
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
    const results: Record<string, string | number> = {};

    this.allFilters().forEach((item) => {
      const val = item.inputValue();
      if (item.label() === val || val === '') {
        results[item.label()] = '';
      } else {
        results[item.label()] = val;
      }
    });

    this.filterChange.emit(results);
  }
}
