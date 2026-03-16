import { Component, inject } from '@angular/core';
import { ProfileOverview } from "./profile-overview/profile-overview";
import { ProfileInformation } from "./profile-information/profile-information";
import { Authservice } from '../../../core/services/auth.service';

@Component({
  selector: 'profile',
  imports: [ProfileOverview, ProfileInformation],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private userService = inject(Authservice);
  public user = this.userService.user;
}
