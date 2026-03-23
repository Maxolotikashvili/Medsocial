import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  public local: InputSignal<boolean> = input<boolean>(false);
}
