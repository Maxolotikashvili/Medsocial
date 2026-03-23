import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { faAnglesLeft, faAnglesRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pagination {
  public readonly pageChange = output<number>();
  public readonly totalPages = input.required<number>();
  public readonly maxDisplayedPages = input<number>(5);

  public previousIcon: IconDefinition = faAnglesLeft;
  public nextIcon: IconDefinition = faAnglesRight;
  
  public currentPage = signal(1);
  public pages = computed(() => {
    const total = this.totalPages();
    const max = this.maxDisplayedPages();
    const current = this.currentPage();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor((max - 1) / 2));
    let end = start + max - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - max + 1);
    }

    start = Math.max(1, start);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

  public hasPrevious = computed(() => this.currentPage() > 1);
  public hasNext = computed(() => this.currentPage() < this.totalPages());
  
  public showRightEllipsis = computed(() => (this.totalPages() - this.pages()[this.pages().length - 1]) > 1);

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }
}