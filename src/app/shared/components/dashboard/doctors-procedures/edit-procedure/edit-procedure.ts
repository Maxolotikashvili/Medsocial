import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HospitalsQuery,
  Procedure,
  ProcedurePayload,
} from '../../../../../core/models/procedures.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyService } from '../../../../../core/services/currency.service';
import { ALL_PROCEDURE_CATEGORIES } from '../../../../../core/configs/procedure.config';
import { MbDropdown } from '../../../../../features/mb-dropdown/mb-dropdown';
import { DropdownOption } from '../../../../../core/models/dropdown.model';
import { useInfiniteData } from '../../../../utilities/use-infinite-data.utility';
import {
  AddressPayload,
  AddressResponse,
  CitiesQuery,
  CountriesQuery,
} from '../../../../../core/models/location.model';
import { LocationService } from '../../../../../core/services/location.service';
import { MbInput } from '../../../../../features/mb-input/mb-input';
import { ScrollFromBreadcrumbDirective } from '../../../../directives/scroll-from-breadcrumb.directive';
import { ModalService } from '../../../../../core/services/modal.service';
import { faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProceduresService } from '../../../../../core/services/procedures.service';
import { EMPTY, empty, Observable, of, switchMap, take } from 'rxjs';
import { UserService } from '../../../../../core/services/user.service';
import { MbCheckbox } from '../../../../../features/mb-checkbox/mb-checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupService } from '../../../../../core/services/popup.service';
import { ErrorService } from '../../../../../core/services/error.service';
import { Loading } from '../../../../../features/loading/loading';
import { HttpErrorResponse } from '@angular/common/http';
import { deepEqual } from '../../../../utilities/object-comparer-utility';
import { MbTextarea } from "../../../../../features/mb-textarea/mb-textarea";

@Component({
  selector: 'edit-procedure',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MbDropdown,
    MbInput,
    ScrollFromBreadcrumbDirective,
    FaIconComponent,
    MbCheckbox,
    Loading,
    MbTextarea
],
  templateUrl: './edit-procedure.html',
  styleUrl: './edit-procedure.scss',
})
export class EditProcedure implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('imageAfterInput') imageAfterInput!: ElementRef;
  @ViewChild('videoInput') videoInput!: ElementRef;

  public existingProcedure: InputSignal<Procedure | null | undefined> = input.required<
    Procedure | null | undefined
>();
  public cancelEditing = output<void>();

  private locationService = inject(LocationService);
  private procedureService = inject(ProceduresService);
  private formBuilder = inject(FormBuilder);
  private currencyService = inject(CurrencyService);
  private modalService = inject(ModalService);
  private destroy$ = inject(DestroyRef);
  private popupService = inject(PopupService);
  private errorService = inject(ErrorService);

  public imageSrc = signal<string>('');
  public imageAfterSrc = signal<string>('');
  public videoSrc = signal<string>('');

  public icons: Record<string, IconDefinition> = {
    save: faFloppyDisk,
    cancel: faXmark,
  };

  public initialFormValue!: any;
  public isLoading: WritableSignal<boolean> = signal(false);
  public procedureForm!: FormGroup;
  public currency = this.currencyService.currency();
  public procedureCategoriesList: DropdownOption[] = ALL_PROCEDURE_CATEGORIES.map(
    (category, index) => {
      return { id: index, value: category };
    },
  );

  public cities = useInfiniteData(
    (params: CitiesQuery, page: number) =>
      this.locationService.getCities({
        country: params.country,
        page: page,
        q: params.q,
      }),
    {
      transform: {
        transformKey: [{ from: 'name', to: 'value' }],
      },
    },
  );

  public countries = useInfiniteData(
    (params: CountriesQuery, page: number) =>
      this.locationService.getCountries({
        q: params.q,
        page: page,
      }),
    {
      transform: {
        transformKey: [{ from: 'name', to: 'value' }],
      },
    },
  );

  public hospitals = useInfiniteData(
    (params: HospitalsQuery, page: number) =>
      this.procedureService.getHospitals({
        description: params.description,
        name: params.name,
        page: page,
      }),
    {
      initialParams: { page: 1 },
      transform: {
        transformKey: [{ from: 'name', to: 'value' }],
      },
    },
  );

  public getOptionsList(controlName: string): DropdownOption[] {
    if (!controlName) return [];

    const optionsList: Record<string, DropdownOption[]> = {
      category: this.procedureCategoriesList,
      country: this.countries.data(),
      city: this.cities.data(),
    };

    return optionsList[controlName];
  }

  constructor() {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    const existingProcedure = this.existingProcedure();

    this.imageSrc.set(existingProcedure?.image ?? '');
    this.imageAfterSrc.set(existingProcedure?.image_after ?? '');

    this.procedureForm = this.formBuilder.group({
      image: [existingProcedure?.image ?? '', Validators.required],
      imageAfter: [existingProcedure?.image_after ?? '', Validators.required],
      title: [existingProcedure?.title ?? '', Validators.required],
      category: [existingProcedure?.category.title ?? '', Validators.required],
      description: [existingProcedure?.description ?? '', Validators.required],
      hospital: [existingProcedure?.hospital ?? '', Validators.required],
      price: [existingProcedure?.price ?? null, Validators.required],
      isDiscount: [Number(existingProcedure?.discounted_price) ? true : false],
      discountedPrice: [existingProcedure?.discounted_price ?? null],
      country: [existingProcedure?.address.country.name ?? '', Validators.required],
      city: [
        {
          value: existingProcedure?.address.city.name ?? '',
          disabled: !this.cities.params().country,
        },
        Validators.required,
      ],
      region: [existingProcedure?.address.region ?? '', Validators.required],
      street: [existingProcedure?.address.street ?? '', Validators.required],
      phone: [existingProcedure?.address.phone ?? '', [Validators.required, Validators.pattern(/^\+?[0-9]*$/)]],
      addressText: [existingProcedure?.address.text ?? '', Validators.required],
      video: [existingProcedure?.video ?? '', Validators.required],
    });

    if (existingProcedure?.video) {
      this.videoSrc.set(existingProcedure.video);
    }

    this.initialFormValue = this.normalizeFormValue(this.procedureForm.getRawValue());
  }

  public triggerFileInput(field: string): void {
    if (field === 'image') {
      this.imageInput.nativeElement.click();
    } else if (field === 'imageAfter') {
      this.imageAfterInput.nativeElement.click();
    } else if (field === 'video') {
      this.videoInput.nativeElement.click();
    }
  }

  public onFileSelected(event: any, field: string): void {
    const file = event.target.files[0];
    if (!file) return;

    this.procedureForm.get(field)?.setValue(file);
    this.procedureForm.get(field)?.markAsDirty();
    this.procedureForm.get(field)?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      const previewResult = reader.result as string;
      if (field === 'video') this.videoSrc.set(previewResult);
      else if (field === 'image') this.imageSrc.set(previewResult);
      else if (field === 'imageAfter') this.imageAfterSrc.set(previewResult);
    };

    reader.readAsDataURL(file);
  }

  public removeVideo() {
    this.videoSrc.set('');
    this.procedureForm.get('video')?.setValue('');

    if (this.videoInput) {
      this.videoInput.nativeElement.value = '';
    }
  }

  public onCountryDropdownChange(country: DropdownOption) {
    this.cities.updateParams({ country: country.value.toString().toLowerCase() });
    if (this.cities.params().country) {
      this.procedureForm.get('city')?.enable();
    } else {
      this.procedureForm.get('city')?.disable();
    }
  }

  public onCountrySearch(query: string) {
    this.countries.updateParams({ q: query } as any);
  }

  public onCitySearch(query: string) {
    const currentSelectedCountry = this.cities.params().country;
    this.cities.updateParams({ country: currentSelectedCountry, q: query } as any);
  }

  public onHospitalSearch(query: string) {
    this.hospitals.updateParams({ name: query } as any);
  }

  public previewImage(image: 'before-image' | 'after-image') {
    if (image === 'before-image') {
      this.modalService.previewImage(this.imageSrc(), { alt: 'stryker', customClass: 'stryker' });
    } else {
      this.modalService.previewImage(this.imageAfterSrc(), {
        alt: 'stryker',
        customClass: 'afterstryker',
      });
    }
  }

  public submitChanges() {
    if (!this.procedureForm.valid) {
      this.procedureForm.markAllAsDirty();
      this.popupService.show({ message: 'Please fill all required inputs', type: 'info' })
      return;
    }

    const current = this.normalizeFormValue(this.procedureForm.getRawValue());

    if (deepEqual(current, this.initialFormValue)) {
      this.popupService.show({
        message: 'Nothing to update',
        type: 'info'
      })

      return;
    }

    const formValue = this.procedureForm.getRawValue();

    const payload: Omit<ProcedurePayload, 'address_id'> = {
      title: formValue.title,
      category: formValue.category,
      description: formValue.description,
      price: formValue.price,
      discounted_price: formValue.discountedPrice ?? null,
      hospital: formValue.hospital.value,
      image: formValue.image,
      image_after: formValue.imageAfter,
      video: formValue.video,
      status: 'AC',
    };

    this.isLoading.set(true);
    if (!this.existingProcedure()) {
      this.submitNewProcedure(payload);
    } else {
      this.submitExistingProcedure({
        ...payload,
        address_id: this.existingProcedure()?.address.id!,
      });
    }
  }

  private submitNewProcedure(payload: Omit<ProcedurePayload, 'address_id'>) {
    this.getAddress()
      .pipe(
        switchMap((address: AddressResponse) =>
          this.procedureService.createProcedure({
            ...payload,
            address_id: address.id,
          }),
        ),
        takeUntilDestroyed(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.popupService.show({ message: 'Procedure created successfully', type: 'success' });
          this.cancelEditing.emit();
        },

         error: (err: HttpErrorResponse) => {
          this.errorService.handleError(err);
          this.isLoading.set(false);
        }
      });
  }

  private submitExistingProcedure(payload: ProcedurePayload) {
    this.procedureService
      .editProcedure({ procedureId: this.existingProcedure()?.id!, body: payload })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.popupService.show({ message: 'Procedure is now updated', type: 'info' })
          this.cancelEditing.emit();
        },

        error: (err: HttpErrorResponse) => {
          this.errorService.handleError(err);
          this.isLoading.set(false);
        }
      });
  }

  private getAddress(): Observable<AddressResponse> {
    const formValue = this.procedureForm.getRawValue();

    const address: AddressPayload = {
      city_id: formValue.city.id,
      country_id: formValue.country.id,
      phone: formValue.phone,
      region: formValue.region,
      street: formValue.street,
      text: formValue.addressText,
    };

    return this.locationService.createAddress(address);
  }

  private normalizeFormValue(value: any): any {
    return {
      ...value,

      hospital: value.hospital?.value ?? value.hospital,
      country: value.country?.value ?? value.country,
      city: value.city?.value ?? value.city,

      price: Number(value.price),
      discountedPrice: Number(value.discountedPrice) || 0,

      title: value.title?.trim(),
      description: value.description?.trim(),
      region: value.region?.trim(),
      street: value.street?.trim(),
      phone: value.phone?.trim?.() ?? value.phone,
      addressText: value.addressText?.trim(),

      image: value.image instanceof File ? 'FILE' : value.image,
      imageAfter: value.imageAfter instanceof File ? 'FILE' : value.imageAfter,
      video: value.video instanceof File ? 'FILE' : value.video,
    };
  }
}
