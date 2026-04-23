import { Component, input } from '@angular/core';

@Component({
  selector: 'loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  public local = input(false);
}
