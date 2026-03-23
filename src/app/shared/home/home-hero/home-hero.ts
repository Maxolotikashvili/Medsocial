import { Component } from '@angular/core';
import { EffectDirective } from "../../directives/effect.directive";
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'home-hero',
  imports: [EffectDirective, TitleCasePipe],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss'
})
export class HomeHero {

}
