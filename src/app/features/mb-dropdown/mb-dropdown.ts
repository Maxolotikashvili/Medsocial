import { Component, input, InputSignal, output, signal, WritableSignal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'mb-dropdown',
  imports: [FontAwesomeModule, ClickOutsideDirective],
  templateUrl: './mb-dropdown.html',
  styleUrl: './mb-dropdown.scss',
})
export class MbDropdown {
  public label: InputSignal<string> = input<string>('Settings');
  public optionsList: InputSignal<string[]> = input<string[]>(['option 1', 'option2', 'option3']);
  public selectionChange = output<string>();

  public isOpen: WritableSignal<boolean> = signal(false);
  public selectedOption: WritableSignal<string> = signal<string>(this.label());

  public angleDown: IconDefinition = faAngleDown;
  public angleUp: IconDefinition = faAngleUp;

  public toggleDropdown() {
      this.isOpen.set(this.isOpen() ? false : true);
  }

  public hideDropdown() {
    this.isOpen.set(false)
  }

  public selectOption(option: string) {
    this.selectedOption.set(option);
    this.selectionChange.emit(option);
    this.toggleDropdown();
  }
}
