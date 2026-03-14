import { Component } from '@angular/core';
import { HomeCategories } from "./home-categories/home-categories";
import { HomeHero } from "./home-hero/home-hero";

@Component({
  selector: 'app-home',
  imports: [HomeCategories, HomeHero],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
