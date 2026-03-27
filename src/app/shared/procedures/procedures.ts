import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ProceduresService } from '../../core/services/procedures.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProcedureCategoryTitle, ProceduresList, ProceduresQueryParams } from '../../core/models/procedures.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Pagination } from '../../features/pagination/pagination';
import { Filters } from '../filters/filters';
import { faCapsules, faEye, faHeartPulse, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ErrorService } from '../../core/services/error.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Loading } from '../../features/loading/loading';
import { CategoryColorPipe } from '../pipes/category-color-pipe';
import { CategoryIconPipe } from '../pipes/category-icon-pipe';
import { MbDropdown } from '../../features/mb-dropdown/mb-dropdown';
import { MbSearch } from "../../features/mb-search/mb-search";
import { LocationService } from '../../core/services/location.service';
import { ALL_PROCEDURE_CATEGORIES } from '../../core/configs/procedure.config';
import { useInfiniteData } from '../utilities/use-infinite-data.utility';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'procedures',
  imports: [Pagination, Filters, FaIconComponent, CategoryColorPipe, CategoryIconPipe, Loading, MbDropdown, MbSearch, FormsModule],
  templateUrl: './procedures.html',
  styleUrl: './procedures.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Procedures {
  private proceduresService = inject(ProceduresService);
  private locationService = inject(LocationService);
  private errorService = inject(ErrorService);

  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public filters: WritableSignal<ProceduresQueryParams> = signal({ page: 1 });

  public icons: { [key: string]: IconDefinition } = {
    eye: faEye,
    pulse: faHeartPulse,
    pills: faCapsules,
  };

  private procedures$ = toObservable(this.filters).pipe(distinctUntilChanged(), tap(() => this.isLoading.set(true)),
    switchMap((params) => this.proceduresService.getProceduresList(params)),
    tap((data) => { this.isLoading.set(false); console.log(data)}),
    catchError((error: HttpErrorResponse) => { this.isLoading.set(false); this.errorService.handleError(error); return of(undefined);}));
  public procedures: Signal<ProceduresList | undefined> = toSignal<ProceduresList | undefined>(this.procedures$);
  
  public hospitals = computed(() => {
    const results = this.procedures()?.results;
    if (!results) return [];

    return this.proceduresService.getHospitals(results);
  })

  public readonly categories: WritableSignal<ProcedureCategoryTitle[]> = signal<ProcedureCategoryTitle[]>(ALL_PROCEDURE_CATEGORIES);

  public cities = useInfiniteData((country: string | null, page: number) => this.locationService.getCities({country: country!, page: page}), null, true)
  public countries = useInfiniteData((_: any, page: number) => this.locationService.getCountries({page: page}), null, true)
  public searchFilterValue: string = '';

  constructor() {}

  public handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'images/home-hero-image.png';
  }

  public handlePageChange(page: number) {
    this.filters.set({ ...this.filters(), page: page });
  }

  public onFiltersChange(value: Record<string, string | number>) {
    const filters = this.proceduresService.mappedProceduresQueryParams(value);
    this.filters.set(filters);
  }

  public onCountryDropdownChange(value: string | number) {
    this.cities.updateParams(value.toString().toLowerCase() as any);
  }
}
