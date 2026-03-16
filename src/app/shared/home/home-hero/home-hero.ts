import { Component } from '@angular/core';
import { Effect } from "../../directives/effect";
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'home-hero',
  imports: [Effect, TitleCasePipe],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss'
})
export class HomeHero {

}
