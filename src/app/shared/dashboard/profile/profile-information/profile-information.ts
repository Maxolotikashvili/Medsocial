import { Component, computed, input, InputSignal } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { USER_ROLES } from '../../../../core/configs/user.config';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'profile-information',
  imports: [TitleCasePipe],
  templateUrl: './profile-information.html',
  styleUrl: './profile-information.scss',
})
export class ProfileInformation {
  public user: InputSignal<User | undefined> = input();

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
}
