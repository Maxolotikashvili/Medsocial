import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { DASHBOARD_SIDEBAR_ROUTES } from '../../../../core/configs/navigation.config';
import { DashboardNavLink } from '../../../../core/models/navigation.model';
import { faAngleRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Authservice } from '../../../../core/services/auth.service';
import { USER_ROLES } from '../../../../core/configs/user.config';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'dashboard-sidebar',
  imports: [TitleCasePipe, RouterLink, FaIconComponent, RouterLinkActive],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
  private userService = inject(UserService);
  private authService = inject(Authservice);
  
  public readonly user = this.userService.user;
  public readonly allRoutes: DashboardNavLink[] = DASHBOARD_SIDEBAR_ROUTES;
  
  public arrowRight: IconDefinition = faAngleRight;

  constructor() {}

  public logOut() {
    this.authService.logOut();
  }

  public handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (this.user().role === USER_ROLES.PATIENT) {
      image.src = 'images/user-placeholder.png';
    } else if (this.user().role === USER_ROLES.DOCTOR) {
      image.src = 'images/doctor-placeholder.png'
    }
  }
}
