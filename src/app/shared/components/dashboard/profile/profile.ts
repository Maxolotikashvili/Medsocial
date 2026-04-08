import { Component, inject } from '@angular/core';
import { ProfileOverview } from "./profile-overview/profile-overview";
import { ProfileInformation } from "./profile-information/profile-information";
import { UserService } from '../../../../core/services/user.service';
import { ScrollFromBreadcrumbDirective } from "../../../directives/scroll-from-breadcrumb.directive";

@Component({
  selector: 'profile',
  imports: [ProfileOverview, ProfileInformation, ScrollFromBreadcrumbDirective],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private userService = inject(UserService);
  public user = this.userService.user;

  constructor() {}
}
