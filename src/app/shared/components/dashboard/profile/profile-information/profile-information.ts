import { Component, computed, inject, input, InputSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ApiUser, UserInfo } from '../../../../../core/models/user.model';
import { formatDate, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MbInput } from '../../../../../features/mb-input/mb-input';
import { UserService } from '../../../../../core/services/user.service';
import { USER_ROLES } from '../../../../../core/configs/user.config';
import { MbCheckbox } from '../../../../../features/mb-checkbox/mb-checkbox';
import { ageValidator } from '../../../../validators/date-validator';
import { PopupService } from '../../../../../core/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../../core/services/error.service';
import { Timezone } from '../../../../../core/models/location.model';
import { LocationService } from '../../../../../core/services/location.service';
import { take } from 'rxjs';
import { MbDropdown } from '../../../../../features/mb-dropdown/mb-dropdown';
import { DropdownOption } from '../../../../../core/models/dropdown.model';
import { extractTimezone } from '../../../../utilities/convert-to-utc.utility';

@Component({
  selector: 'profile-information',
  imports: [ReactiveFormsModule, TitleCasePipe, MbInput, ReactiveFormsModule, MbCheckbox, MbDropdown],
  templateUrl: './profile-information.html',
  styleUrl: './profile-information.scss',
})
export class ProfileInformation implements OnInit {
  public user: InputSignal<ApiUser | undefined> = input();

  private formBuilder = inject(FormBuilder);
  private locationService = inject(LocationService);
  private userService = inject(UserService);
  private popupService = inject(PopupService);
  private errorService = inject(ErrorService);

  public readonly minBirthDate: string = formatDate(new Date().setFullYear(new Date().getFullYear() - 140), 'yyyy-MM-dd', 'en-US');
  public readonly maxBirthDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en-us');
  public userForm!: FormGroup;
  public isEditModeOn: WritableSignal<boolean> = signal<boolean>(false);
  public timeZones: WritableSignal<DropdownOption[]> = signal([]);
  public userInfo: Signal<{ key: string; value: string | number }[]> = computed(() => {
    if (this.isEditModeOn()) return [];

    const user = this.user();
    if (!user) {
      return [
        { key: 'First name', value: '' },
        { key: 'Last name', value: '' },
        { key: 'Age', value: 0 },
        { key: 'Timezone', value: '' },
        { key: 'Email', value: '' },
        { key: 'Phone', value: '' },
      ];
    }

    const baseInfo: { key: string; value: string | number }[] = [
      { key: 'First name', value: user.first_name },
      { key: 'Last name', value: user.last_name },
      { key: 'Age', value: user.age_is_public ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 0 },
      { key: 'Timezone', value: user.timezone },
      { key: 'Email', value: user.email },
      { key: 'Phone', value: user.phone },
    ].filter((item) => item.value);

    if (user.role === USER_ROLES.DOCTOR) {
      baseInfo.splice(2, 0, { key: 'Title', value: user.title || '' });
      baseInfo.splice(3, 0, { key: 'Bio', value: user.bio || '' });
    }

    return baseInfo;
  });

  public formFields: Signal<{controlName: string; label: string; type: 'text' | 'date' | 'checkbox' | 'number' | 'dropdown'; value: string | number | boolean;}[]> = computed(() => {
    const base: {
      controlName: string;
      label: string;
      type: 'text' | 'date' | 'checkbox' | 'number' | 'dropdown';
      value: string | number | boolean;
    }[] = [
      {
        controlName: 'firstName',
        label: 'First Name',
        type: 'text',
        value: this.user()?.first_name || '',
      },
      {
        controlName: 'lastName',
        label: 'Last Name',
        type: 'text',
        value: this.user()?.last_name || '',
      },
      { controlName: 'phone', label: 'Phone', type: 'number', value: this.user()?.phone || '' },
      { controlName: 'email', label: 'Email', type: 'text', value: this.user()?.email || '' },
      { controlName: 'dob', label: 'Date of Birth', type: 'date', value: this.user()?.dob || '' },
      {
        controlName: 'timezone',
        label: 'Timezone',
        type: 'dropdown',
        value: this.user()?.timezone || '',
      },
      { controlName: 'image', label: 'Image', type: 'text', value: this.user()?.image || '' },
      {
        controlName: 'isAgePublic',
        label: 'Show age in public',
        type: 'checkbox',
        value: this.user()?.age_is_public || false,
      },
    ];

    if (this.user()?.role === USER_ROLES.DOCTOR) {
      base.splice(2, 0, {
        controlName: 'title',
        label: 'Title',
        type: 'text',
        value: this.user()?.title || '',
      });

      base.splice(3, 0, {
        controlName: 'bio',
        label: 'Bio',
        type: 'text',
        value: this.user()?.bio || ''
      })
    }

    return base;
  });

  constructor() {}

  ngOnInit(): void {
    this.setUpUserForm();
    this.getTimeZones();
  }

  private setUpUserForm() {
    const user = this.user();

    this.userForm = this.formBuilder.group({
      firstName: [user?.first_name || ''],
      lastName: [user?.last_name || ''],
      ...(this.user()?.role === USER_ROLES.DOCTOR && {
        bio: [user?.bio || ''],
      }),
      phone: [user?.phone || 0],
      email: [user?.email || ''],
      dob: [user?.dob || '', ageValidator],
      timezone: [user?.timezone || ''],
      image: [user?.image || ''],
      isAgePublic: [user?.age_is_public || false],
      ...(this.user()?.role === USER_ROLES.DOCTOR && {
        title: [user?.title || ''],
      }),
    });
  }

  private getTimeZones() {
    this.locationService.getTimezones().pipe(take(1)).subscribe({
      next: (timeZones: Timezone[]) => {
        const dropDownTimezone: DropdownOption[] = timeZones.map((timeZone) => {return {id: timeZone.id, value: timeZone.name}});
        this.timeZones.set(dropDownTimezone);

        const userTz = this.user()?.timezone;

        if (userTz) {
          const selected = dropDownTimezone.find(tz => tz.value === userTz);
          if (selected) {
            this.userForm.patchValue({ timezone: selected });
          }
        }
      },

      error: (error: HttpErrorResponse) => {this.errorService.handleError(error)}
    })
  }

  public submitUserForm() {
    if (this.userForm.status !== 'VALID') return;

    const formValue = this.userForm.value;
    const user = this.user();

    const keyMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      isAgePublic: 'age_is_public',
    };

    const payload: Partial<UserInfo> = {};

    Object.keys(formValue).forEach((formKey) => {
      const apiKey = (keyMap[formKey] || formKey) as keyof Partial<UserInfo>;

      let newValue = formValue[formKey];

      if (formKey === 'timezone' && newValue) {
        newValue = extractTimezone(newValue.value);
      }
      const oldValue = user ? (user as any)[apiKey] : undefined;

      const newStr = newValue != null ? newValue.toString().toLowerCase() : '';
      const oldStr = oldValue != null ? oldValue.toString().toLowerCase() : '';
      if (newStr && newStr !== oldStr) {
        payload[apiKey] = newValue;
      }
    });
    console.log(payload);
    if (user && Object.values(payload).length > 0) {
      this.userService.updateUserInfo(user.id, payload).subscribe({
        next: (newUser: UserInfo) => {
          this.userService.updateUser(newUser);
          this.popupService.show({message: 'Profile information is now updated', type: 'success'})
        },

        error: (error: HttpErrorResponse) => {
          this.errorService.handleError(error);
        }
      });
    }

    this.isEditModeOn.set(false);
  }
}
