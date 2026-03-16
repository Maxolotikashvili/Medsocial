import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebar } from './dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, DashboardSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
}
