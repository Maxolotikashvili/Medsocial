import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ProceduresService } from '../../core/services/procedures.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProceduresList, ProceduresQueryParams } from '../../core/models/procedures.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Pagination } from '../../features/pagination/pagination';
import { Filters } from '../filters/filters';
import { faCapsules, faEye, faHeartPulse, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ErrorService } from '../../core/services/error.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Loading } from '../../features/loading/loading';
import { CategoryColorPipe } from '../pipes/category-color-pipe';
import { CategoryIconPipe } from '../pipes/category-icon-pipe';
import { MbDropdown } from '../../features/mb-dropdown/mb-dropdown';
import { getLocation } from '../utilities/location-getter.utility';

@Component({
  selector: 'procedures',
  imports: [
    Pagination,
    Filters,
    FaIconComponent,
    CategoryColorPipe,
    CategoryIconPipe,
    Loading,
    MbDropdown,
  ],
  templateUrl: './procedures.html',
  styleUrl: './procedures.scss',
})
export class Procedures {
  private proceduresService = inject(ProceduresService);
  private errorService = inject(ErrorService);

  public isLoading: WritableSignal<boolean> = signal(false);
  public filters: WritableSignal<ProceduresQueryParams> = signal({ page: 1 });

  public icons: { [key: string]: IconDefinition } = {
    eye: faEye,
    pulse: faHeartPulse,
    pills: faCapsules,
  };

  private procedures$ = toObservable(this.filters).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap((params) => this.proceduresService.getProceduresList(params)),
    tap((data) => {
      this.isLoading.set(false);
      console.log(data);
    }),
    catchError((error: HttpErrorResponse) => {
      this.errorService.handleError(error);
      return of(undefined);
    }),
  );
  public procedures: Signal<ProceduresList | undefined> = toSignal<ProceduresList | undefined>(
    this.procedures$,
  );
  public totalPages: Signal<number> = computed(() => {
    const data = this.procedures();
    if (!data) return 0;
    return Math.ceil(data.count / (data.results.length || 1));
  });

  public availableLocations = computed(() => {
    const results = this.procedures()?.results;
    if (!results) return [];

    const locations = getLocation(results);
    return [...new Set(locations.map((location) => location.city))];
  });

  constructor() {}

  public handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'images/home-hero-image.png';
  }

  public handlePageChange(page: number) {
    this.filters.set({ ...this.filters(), page: page });
  }

  public onFiltersChange(value: Record<string, string | number>) {
    const filters = this.mapFilterNames(value);
    console.log(value)
    // this.filters.set(filters);
  }

  private mapFilterNames(value: Record<string, string | number>): ProceduresQueryParams {
    const keyMap: Record<string, keyof ProceduresQueryParams> = {
      Location: 'city',
      Department: 'title',
      Search: 'name'
    }

    const transformedFilters = Object.entries(value).reduce(
      (acc, [key, val]) => {
        const mappedKey = keyMap[key] ?? key;
        acc[mappedKey] = val;
        return acc;
      },{} as Record<string, string | number>
    );

    return transformedFilters;
  }
}
