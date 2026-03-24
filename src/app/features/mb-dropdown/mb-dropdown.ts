import { Component, input, output, signal, computed, effect, isDevMode } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { FilterItem } from '../../core/tokens/filter-injection-token';

@Component({
  selector: 'mb-dropdown',
  templateUrl: './mb-dropdown.html',
  styleUrl: './mb-dropdown.scss',
  imports: [FaIconComponent, ClickOutsideDirective],
  providers: [{ provide: FilterItem, useExisting: MbDropdown }],
})
export class MbDropdown {
  public label = input.required<string>();
  public optionsList = input.required<(string | number)[]>();
  public selectionChange = output<string | number>();

  public isOpen = signal(false);
  public inputValue = signal<string | number>('');

  public icons: { [key: string]: IconDefinition } = {
    angleUp: faAngleUp,
    angleDown: faAngleDown,
  };

  constructor() {
    effect(() => {
      this.inputValue.set(this.label());
      this.handleErrorCase();
    });
  }

  private handleErrorCase() {
    if (this.optionsList().toString().toLowerCase().includes(this.label().toString().toLowerCase())) {
      const errorMessage = `[MbDropdown Developer Error]: 
        Collision detected! The label "${this.label()}" is also present in your [optionsList]. 
        
        This is forbidden because "mb-dropdown" automatically handles the label 
        as a reset option at the bottom of the list. 
        
        FIX: Remove "${this.label()}" from the array you are passing to [optionsList].`;

      if (isDevMode()) {
        throw new Error(errorMessage);
      } else {
        console.error(errorMessage);
      }
    }
  }

  public displayedLabel = computed(() => {
    return this.inputValue() || this.label();
  });

  public displayedOptionsList = computed(() => {
    const selected = this.inputValue();
    const label = this.label();

    let options = this.optionsList().filter((opt) => opt !== selected);

    if (selected !== null && selected !== label && !options.includes(label)) {
      options = [...options, label];
    }

    return options;
  });

  public toggleDropdown(state?: 'on' | 'off') {
    if (state === 'on') return this.isOpen.set(true);
    if (state === 'off') return this.isOpen.set(false);

    this.isOpen.update((v) => !v);
  }

  public selectOption(option: string | number) {
    this.inputValue.set(option);
    if (option !== this.label()) {
      this.selectionChange.emit(option);
    } else {
      this.selectionChange.emit('');
    }
    this.isOpen.set(false);
  }
}
