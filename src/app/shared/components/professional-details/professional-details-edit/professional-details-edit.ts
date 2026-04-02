import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MbInput } from '../../../../features/mb-input/mb-input';
import { MbDropdown } from "../../../../features/mb-dropdown/mb-dropdown";
import { EDUCATION_DEGREES } from '../../../../core/configs/procedure.config';
import { UserService } from '../../../../core/services/user.service';
import { ageValidator } from '../../../validators/date-validator';
import { createAgeValidator } from '../../../validators/experience-date.validator';
import { PopupService } from '../../../../core/services/popup.service';
import { ErrorService } from '../../../../core/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  public degreeOptionsList = EDUCATION_DEGREES;

  get items() {
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
      this.items.push(this.createGroup(item));
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
        image: [item?.image || '']
      });
    } else {
      return this.fb.group({
        id: [item?.id || null],
        workTitle: [item?.workTitle || '', Validators.required],
        from: [item?.from_date || null, [Validators.required, ageValidator]],
        till: [item?.till_date || null, [Validators.required, ageValidator]],
        description: [item?.description || '', Validators.required],
        image: [item?.image || null]
      });
    }
  }

  public addNewFormArray() {
    this.items.push(this.createGroup());
  }

  public saveItem(index: number) {
    const group = this.items.at(index) as FormGroup;
    const payload = group.value;

    if (payload.id) {
      const user = this.userService.user();

      if (this.type() === 'education') {
        const educationRequestObj = {
          degree: payload.degree,
          university: payload.university,
          from_date: payload.from,
          till_date: payload.till,
          description: payload.description,
          ...(() => {if (payload.image) return payload.image})
        }
        this.userService.updateEducation(user.id, payload.id, educationRequestObj).subscribe({
          next: () => {
            this.popupService.show('Request has been sent', 'success');
            this.cancelEditMode.emit();
          },

          error: (error: HttpErrorResponse) => {this.errorService.handleError(error)}
        });
      }
    } else {
      console.log(`POST request to create new ${this.type()}`, payload);
    }
  }
}