import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DashboardSidebar } from './dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, TitleCasePipe, DashboardSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  public readonly currentUrl = this.router.url;
}
