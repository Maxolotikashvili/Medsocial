import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebar } from './dashboard-sidebar/dashboard-sidebar';
import { ScrollFromBreadcrumbDirective } from "../directives/scroll-from-breadcrumb.directive";

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, DashboardSidebar, ScrollFromBreadcrumbDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
}
