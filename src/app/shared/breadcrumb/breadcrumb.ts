import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'breadcrumb',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class Breadcrumb {
  private router = inject(Router);
  public separator = faAngleRight;

  constructor() {
  }

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      distinctUntilChanged()
    ),
    { initialValue: this.router.url }
  );

  public isVisible = computed(() => this.currentUrl() !== '/home');

  public crumbs = computed(() => {
    const url = this.currentUrl();
    const parts = url.split('/').filter(Boolean);

    if (parts[0] === 'home' || parts[0] === 'dashboard') {
      parts.shift();
    }

    let builtUrl = '';
    return parts.map(part => {
      builtUrl += `/${part}`;
      return { label: this.formatLabel(part), url: builtUrl };
    });
  });

  private formatLabel(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}