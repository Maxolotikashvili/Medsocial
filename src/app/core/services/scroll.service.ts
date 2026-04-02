import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private breadcrumbHeight = signal<number>(0);

  constructor() {}

  public updateHeight(height: number) {
    this.breadcrumbHeight.set(height);
  }

  public scrollFromBreadcrumb() {
    requestAnimationFrame(() => {
      const height: number = this.breadcrumbHeight();
      
      window.scrollTo({
        top: height,
        behavior: 'smooth',
      });
    });
  }
}
