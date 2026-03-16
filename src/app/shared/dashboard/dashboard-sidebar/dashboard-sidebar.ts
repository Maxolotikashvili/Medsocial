import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { DASHBOARD_SIDEBAR_ROUTES } from '../../../core/configs/navigation.config';
import { DashboardNavLink } from '../../../core/models/navigation.model';
import { faAngleRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Authservice } from '../../../core/services/auth.service';

@Component({
  selector: 'dashboard-sidebar',
  imports: [TitleCasePipe, RouterLink, FaIconComponent, RouterLinkActive],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
  private authService = inject(Authservice);
  public user = this.authService.user;
  public readonly allRoutes: DashboardNavLink[] = DASHBOARD_SIDEBAR_ROUTES;
  public arrowRight: IconDefinition = faAngleRight;

  constructor() {}

  public logOut() {
    this.authService.logOut();
  }
}
