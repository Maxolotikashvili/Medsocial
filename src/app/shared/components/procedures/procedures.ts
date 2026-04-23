import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input, InputSignal, OnInit, output, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { ProceduresService } from '../../../core/services/procedures.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HospitalsQuery, PaginatedResponse, Procedure, ProceduresQueryParams } from '../../../core/models/procedures.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Pagination } from '../../../features/pagination/pagination';
import { Filters } from '../filters/filters';
import { faCapsules, faEye, faGrip, faHeartPulse, faHospital, faList, faLocationDot, faPenToSquare, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ErrorService } from '../../../core/services/error.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Loading } from '../../../features/loading/loading';
import { CategoryColorPipe } from '../../pipes/category-color.pipe';
import { CategoryIconPipe } from '../../pipes/category-icon.pipe';
import { MbDropdown } from '../../../features/mb-dropdown/mb-dropdown';
import { MbSearch } from '../../../features/mb-search/mb-search';
import { LocationService } from '../../../core/services/location.service';
import { ALL_PROCEDURE_CATEGORIES } from '../../../core/configs/procedure.config';
import { useInfiniteData } from '../../utilities/use-infinite-data.utility';
import { FormsModule } from '@angular/forms';
import { shallowEqual } from '../../utilities/object-comparer-utility';
import { CitiesQuery, CountriesQuery } from '../../../core/models/location.model';
import { getObjectLengthBy } from '../../utilities/detect-object-length.utility';
import { RouterLink } from '@angular/router';
import { faCashApp } from '@fortawesome/free-brands-svg-icons';
import { ScrollFromBreadcrumbDirective } from '../../directives/scroll-from-breadcrumb.directive';
import { ScrollService } from '../../../core/services/scroll.service';
import { DropdownOption } from '../../../core/models/dropdown.model';
import { Filter } from '../../../core/models/filter.model';
import { CurrencyService } from '../../../core/services/currency.service';

@Component({
  selector: 'procedures',
  imports: [Pagination, Filters, FaIconComponent, CategoryColorPipe, CategoryIconPipe, Loading, MbDropdown, MbSearch, FormsModule, RouterLink, ScrollFromBreadcrumbDirective],
  templateUrl: './procedures.html',
  styleUrl: './procedures.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Procedures {
  private proceduresService = inject(ProceduresService);
  private locationService = inject(LocationService);
  private errorService = inject(ErrorService);
  private scrollService = inject(ScrollService);
  private currencyService = inject(CurrencyService);
  private injector = inject(Injector);

  public enableFilters: InputSignal<boolean> = input<boolean>(false);
  public initialFilters: InputSignal<ProceduresQueryParams | null> = input<ProceduresQueryParams | null>(null);
  public defaultLayout: InputSignal<'view-list' | 'view-grid'> = input<'view-list' | 'view-grid'>('view-grid');
  public isEditModeOn: InputSignal<boolean> = input<boolean>(false);
  public refreshData = input<number>(0);

  public addNewProcedure = output();
  public editExistingProcedure = output<Procedure>();
  public deleteProcedure = output<Procedure>();

  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public filters: WritableSignal<ProceduresQueryParams> = signal({});
  public selectLayout: WritableSignal<'view-list' | 'view-grid' | ''> = signal('');
  public layoutClass: Signal<'view-list' | 'view-grid'> = computed(() => {
    const defaultLayout = this.defaultLayout();
    const selectedLayout = this.selectLayout();

    if (!selectedLayout) {
      return defaultLayout;
    } else {
      return selectedLayout;
    }
  });

  public icons: Record<string, IconDefinition> = {
    eye: faEye,
    pulse: faHeartPulse,
    pills: faCapsules,
    price: faCashApp,
    location: faLocationDot,
    hospital: faHospital,
    grid: faGrip,
    list: faList,
    delete: faTrash,
    edit: faPenToSquare
  };
  public currency = this.currencyService.currency;

  private procedures$ = toObservable(this.filters).pipe(
    distinctUntilChanged(),
    tap(() => this.isLoading.set(true)),
    switchMap((params) => this.proceduresService.getProceduresList(params)),
    tap((data) => {
      this.isLoading.set(false);
      console.log(data);
    }),
    catchError((error: HttpErrorResponse) => {
      this.isLoading.set(false);
      this.errorService.handleError(error);
      return of(undefined);
    }),
  );
  public procedures: Signal<PaginatedResponse<Procedure> | undefined> = toSignal<PaginatedResponse<Procedure> | undefined>(this.procedures$);

  public readonly categories = computed<DropdownOption[]>(() => {
    let procedureCategoriesList: DropdownOption[] = [];

    procedureCategoriesList = ALL_PROCEDURE_CATEGORIES.map((items, index) => {
      return {
        id: index,
        value: items,
      };
    });

    return procedureCategoriesList;
  });

  public hospitals = useInfiniteData(
    (params: HospitalsQuery) =>
      this.proceduresService.getHospitals({
        description: params.description,
        page: params.page,
        name: params.name,
      }),
    {
      transform: {
        transformKey: [{ from: 'name', to: 'value' }],
      },
    },
  );

  public cities = useInfiniteData(
    (params: CitiesQuery) =>
      this.locationService.getCities({
        country: params.country,
        page: params.page,
        q: params.q,
      }),
    {
      transform: {
        transformKey: [{ from: 'name', to: 'value' }],
      },
    },
  );

  public countries = useInfiniteData(
    (_: CountriesQuery, page: number) => this.locationService.getCountries({ page: page }),
    {
      transform: {
        transformKey: [{ from: 'name', to: 'value' }],
        remove: ['code', 'phone_code'],
      },
    },
  );

  constructor() {
    effect(() => { this.refresh(); });
    effect(() => { this.loadInitialQueryParams(); });
  }

  private loadInitialQueryParams() {
    const initial = this.initialFilters();

    if (initial) {
      this.filters.set(initial);
    }
  }

  private refresh() {
    this.refreshData();

    untracked(() => {
      this.filters.set({ ...this.filters() });
    });
  }

  public handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'images/home-hero-image.png';
  }

  public handlePageChange(page: number) {
    this.filters.set({ ...this.filters(), page: page });
    this.scrollService.scrollFromBreadcrumb();
  }

  public onFiltersChange(value: Partial<Filter>) {
    if (shallowEqual(this.filters(), value)) {
      return;
    }

    if (!getObjectLengthBy('keys', value)) {
      this.countries.updateParams({});
      this.cities.updateParams({});
    }

    const filters = this.proceduresService.mapProceduresQueryParams(value);
    this.filters.set(filters);
    this.scrollService.scrollFromBreadcrumb();
  }

  public onSearchChange(value: string) {
    if (!getObjectLengthBy('values', this.filters()) && !value) {
      return;
    }

    const searchFilter = this.proceduresService.mapProceduresQueryParams({ search: value });
    this.filters.set(searchFilter);
  }

  public onCountryDropdownChange(country: DropdownOption) {
    this.cities.updateParams({ country: country.value.toString().toLowerCase() });
  }

  public onCountrySearch(query: string) {
    this.countries.updateParams({ q: query } as any);
  }

  public onCityDropdownChange(city: DropdownOption) {
    this.hospitals.updateParams({ name: city.value.toString().toLowerCase() });
  }

  public onCitySearch(query: string) {
    const currentSelectedCountry = this.cities.params().country;
    this.cities.updateParams({ country: currentSelectedCountry, q: query } as any);
  }

  public onHospitalSearch(query: string) {
    this.hospitals.updateParams({ q: query } as any);
  }

  public emitAddNewProcedure() {
    this.addNewProcedure.emit();
  }

  public emitEditExistingProcedure(procedure: Procedure) {
    this.editExistingProcedure.emit(procedure);
  }

  public emitDeleteProcedure(procedure: Procedure) {
    this.deleteProcedure.emit(procedure);
  }
}
