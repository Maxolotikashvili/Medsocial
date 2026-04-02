import { Component, effect, inject } from '@angular/core';
import { ProfileOverview } from "./profile-overview/profile-overview";
import { ProfileInformation } from "./profile-information/profile-information";
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'profile',
  imports: [ProfileOverview, ProfileInformation],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private userService = inject(UserService);
  public user = this.userService.user;
  constructor() {
    effect(() => console.log(this.user()))
  }
}
