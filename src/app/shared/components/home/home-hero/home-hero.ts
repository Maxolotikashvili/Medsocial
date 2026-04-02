import { Component } from '@angular/core';
import { EffectDirective } from "../../../directives/effect.directive";
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'home-hero',
  imports: [EffectDirective, TitleCasePipe, RouterLink],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss'
})
export class HomeHero {
}
