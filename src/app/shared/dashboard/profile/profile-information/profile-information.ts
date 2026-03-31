import { Component, computed, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { ApiUser } from '../../../../core/models/user.model';
import { USER_ROLES } from '../../../../core/configs/user.config';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MbInput } from "../../../../features/mb-input/mb-input";

@Component({
  selector: 'profile-information',
  imports: [ReactiveFormsModule, TitleCasePipe, MbInput],
  templateUrl: './profile-information.html',
  styleUrl: './profile-information.scss',
})
export class ProfileInformation implements OnInit {
  public user: InputSignal<ApiUser | undefined> = input();

  private formBuilder = inject(FormBuilder);

  public userForm!: FormGroup;

  public userInfoList = computed(() => {
    const user = this.user();
    if (!user) return [];

    const fullName = `${user.first_name} ${user.last_name}`;
    const age = (new Date().getFullYear() - new Date(user.dob).getFullYear()).toString();

    return [
      {name: 'name', value: fullName},
      {name: 'phone', value: user.phone || ''},
      {name: 'email', value: user.email},
      {name: 'title', value: user.role === USER_ROLES.DOCTOR ? user.title || '' : ''},
      {name: 'age', value: age || ''},
      {name: 'city', value: user.timezone || ''},
    ];
  });
  public editMode: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.userForm = this.formBuilder.group({
      name: [''],
      phone: [''],
      email: [''],
      title: [''],
      age: [''],
      city: ['']
    })
  }

  public setInputType(fieldName: string): "email" | "text" | "password" | "date" | 'number' {
    if (fieldName === 'email') {
      return 'email';
    } else if (fieldName === 'age') {
      return 'number';
    } else {
      return 'text';
    }
  }
}
