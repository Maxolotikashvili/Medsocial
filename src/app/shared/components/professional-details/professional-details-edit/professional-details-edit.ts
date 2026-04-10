import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MbInput } from '../../../../features/mb-input/mb-input';
import { MbDropdown } from '../../../../features/mb-dropdown/mb-dropdown';
import { EDUCATION_DEGREES } from '../../../../core/configs/procedure.config';
import { UserService } from '../../../../core/services/user.service';
import { ageValidator } from '../../../validators/date-validator';
import { PopupService } from '../../../../core/services/popup.service';
import { ErrorService } from '../../../../core/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Education, EducationPayload, Experience, ExperiencePayload } from '../../../../core/models/doctor.model';
import { EMPTY, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'professional-details-edit',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, TitleCasePipe, MbInput, MbDropdown],
  templateUrl: './professional-details-edit.html',
  styleUrl: './professional-details-edit.scss',
})
export class ProfessionalDetailsEdit implements OnInit {
  public readonly data = input.required<any[]>();
  public readonly type = input.required<'education' | 'experience' | ''>();
  public readonly cancelEditMode = output<void>();

  private fb = inject(FormBuilder);
  public form!: FormGroup;
  private userService = inject(UserService);
  private popupService = inject(PopupService);
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);

  public degreeOptionsList = Array.from(EDUCATION_DEGREES).map((degree, index) => {
    return {
      id: index,
      value: degree
    }
  });

  get formItems() {
    return this.form.get('items') as FormArray;
  }

  constructor() {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
    this.patchExistingData();
  }

  private patchExistingData() {
    this.data().forEach((item) => {
      this.formItems.push(this.createGroup(item));
    });
  }

  private createGroup(item: any = null): FormGroup {
    if (this.type() === 'education') {
      return this.fb.group({
        id: [item?.id || null],
        university: [item?.university || ''],
        degree: [item?.degree || ''],
        from: [item?.from_date || ''],
        till: [item?.till_date || ''],
        description: [item?.description || ''],
        image: [item?.image || ''],
      });
    } else {
      return this.fb.group({
        id: [item?.id || null],
        workTitle: [item?.work_title || '', Validators.required],
        from: [item?.from_date || null, [Validators.required, ageValidator]],
        till: [item?.till_date || null, [Validators.required, ageValidator]],
        description: [item?.description || '', Validators.required],
        image: [item?.image || null],
      });
    }
  }

  public addNewFormArray() {
    this.formItems.push(this.createGroup());
  }

  public submitForm(index: number) {
    const group = this.formItems.at(index) as FormGroup;
    const payload = group.value;

    if (payload.id && this.type()) {
      this.updateExisting(payload).subscribe({
        next: (res) => {
          console.log(res)
          this.popupService.show({message: 'Changes have been applied', type: 'success'});
          this.cancelEditMode.emit();
        },

        error: (error: HttpErrorResponse) => this.errorService.handleError(error)
      });

    } else {
      this.addNew(payload).subscribe({
        next: () => {
          this.cancelEditMode.emit();
          this.popupService.show({message: 'Update request has been sent', type: 'success'})
        }, 

        error: (error: HttpErrorResponse) => {
          this.errorService.handleError(error);
        }
      });
    }
  }

  private updateExisting(payload: any): Observable<Education | Experience> {
    const user = this.userService.user();

    let requestPayload: Partial<ExperiencePayload | EducationPayload> = {
      from_date: payload.from,
      till_date: payload.till,
      description: payload.description,
    };

    if (payload.image) {
      requestPayload = {
        ...requestPayload,
        image: payload.image,
      } as Partial<ExperiencePayload| EducationPayload>;
    }

    if ('university' in payload) {
      requestPayload = {
        ...requestPayload,
        university: payload.university,
        degree: payload.degree.value,
      } as Partial<EducationPayload>;
      console.log(requestPayload)
      return this.userService.updateEducation({userId: user.id, educationId: payload.id, body: requestPayload}).pipe(takeUntilDestroyed(this.destroyRef));
    } else if ('workTitle' in payload) {
      requestPayload = {
        ...requestPayload,
        work_title: payload.workTitle,
      } as Partial<ExperiencePayload>;

      return this.userService.updateExperience({userId: user.id, experienceId: payload.id, body: requestPayload}).pipe(takeUntilDestroyed(this.destroyRef));
    }

    return EMPTY;
  }

  private addNew(payload: any): Observable<Education | Experience> {
    const user = this.userService.user();

    let requestPayload = {
      from_date: payload.from,
      till_date: payload.till,
      description: payload.description
    } 

    if (payload.image) {
      requestPayload = {
        ...requestPayload,
        image: payload.image
      } as EducationPayload | ExperiencePayload
    }

    if ('university' in payload) {
      requestPayload = {
        ...requestPayload,
        university: payload.university,
        degree: payload.degree.value,
      } as EducationPayload

      return this.userService.addNewEducation({userId: user.id, body: requestPayload as EducationPayload})
    } else if ('workTitle' in payload) {
      requestPayload = {
        ...requestPayload,
        work_title: payload.workTitle
      } as ExperiencePayload

      return this.userService.addNewExperience({userId: user.id, body: requestPayload as ExperiencePayload});
    }

    return EMPTY;
  }
}
