import { ChangeDetectionStrategy, Component, computed, input, output, signal, WritableSignal } from '@angular/core';
import { faStar as nonSelectedFaStar, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faStar as selectedFaStar } from '@fortawesome/free-solid-svg-icons';
import { RatingType, RatingValue } from '../../../core/models/rating.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'rating',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Rating {
  public mode = input.required<RatingType>();
  public rating = input<number>(0);
  public submitRating = output<RatingValue>();

  public hoveredStar = signal<number | null>(null);
  public temporarySelection = signal<RatingValue | null>(null);
  private isSubmited: WritableSignal<boolean> = signal<boolean>(false);

  private readonly icons = {
    selected: selectedFaStar,
    nonSelected: nonSelectedFaStar,
  };

  public displayedIcons = computed(() => {
    const icons: IconDefinition[] = [];
    const currentMode = this.mode();
    
    let effectiveRating: number = Math.round(this.rating());
    
    if (currentMode === 'write' && !this.isSubmited()) {
      if (this.hoveredStar() !== null) {
        effectiveRating = this.hoveredStar()! + 1;
      } else if (this.temporarySelection() !== null) {
        effectiveRating = this.temporarySelection()!;
      }
    }

    for (let i = 1; i <= 5; i++) {
      icons.push(i <= effectiveRating ? this.icons.selected : this.icons.nonSelected);
    }
    return icons;
  });

  public handleHover(index: number | null) {
    if (this.mode() === 'write' && !this.isSubmited()) {
      this.hoveredStar.set(index);
    }
  }

  public handleSelect(value: number) {
    if (this.mode() === 'write' && !this.isSubmited()) {
      this.temporarySelection.set(value as RatingValue);
    }
  }

  public emitFinalRating() {
    const val = this.temporarySelection();
    if (val !== null && !this.isSubmited()) {
      this.submitRating.emit(val);
      this.isSubmited.set(true);
    }
  }
}