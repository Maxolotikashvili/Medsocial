import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NgStyle } from '../../../../node_modules/@angular/common/types/_common_module-chunk';

@Component({
  selector: 'breadcrumb',
  imports: [RouterModule, FaIconComponent],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb implements OnInit, OnDestroy {
  private router = inject(Router);

  public crumbs: Array<{ label: string; url: string }> = [];
  public isVisible: boolean = true;
  private sub!: Subscription;

  public separator: IconDefinition = faAngleRight;

  constructor() {}

  ngOnInit(): void {
    this.listenToRouteChanges();
  }

  private listenToRouteChanges() {
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((navEnd) => this.buildCrumbs(navEnd.urlAfterRedirects));
  }

  private buildCrumbs(url: string) {
    this.isVisible = url !== '/home';

    const parts = url.split('/').filter(Boolean);

    if (parts[0] === 'home' || parts[0] === 'dashboard') {
      parts.shift();
    }

    const crumbs: Array<{ label: string; url: string }> = [];
    let builtUrl = '';

    parts.forEach((part) => {
      builtUrl += `/${part}`;
      crumbs.push({ label: this.formatLabel(part), url: builtUrl });
    });

    this.crumbs = crumbs;
  }

  private formatLabel(segment: string) {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
