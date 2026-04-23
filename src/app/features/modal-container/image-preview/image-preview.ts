import { Component } from '@angular/core';
import { PreviewImageData } from '../../../core/models/modal.model';

@Component({
  selector: 'image-preview',
  imports: [],
  templateUrl: './image-preview.html',
  styleUrl: './image-preview.scss',
})
export class ImagePreview {
  public modalData?: PreviewImageData;

  constructor() {}
}
