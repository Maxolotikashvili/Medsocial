import { Component, inject, input, InputSignal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map {
  private sanitizer = inject(DomSanitizer);

  public location: InputSignal<string> = input<string>('');

  get mapUrl() {
    const encoded = encodeURIComponent(this.location());
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps?q=${encoded}&output=embed`);
  }
}
