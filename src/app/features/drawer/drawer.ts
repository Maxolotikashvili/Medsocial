import { Component, input, InputSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'drawer',
  imports: [ButtonModule, DrawerModule, FormsModule],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss',
})
export class Drawer {
  public visible = input<boolean>(false);
  public header = input<string>('Drawer');
  public blockScroll = input<boolean>(false);
  public position = input<'left' | 'right' | 'top' | 'bottom'>('right');
  public widthInPercent = input<number>(50);
  
  public closed = output<void>();
}