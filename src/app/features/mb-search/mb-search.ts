import { Component } from '@angular/core';
import { FilterItem } from '../../core/tokens/filter-injection-token';

@Component({
  selector: 'app-mb-search',
  imports: [],
  providers: [{provide: FilterItem, useExisting: MbSearch}],
  templateUrl: './mb-search.html',
  styleUrl: './mb-search.scss',
})
export class MbSearch {
  
}
