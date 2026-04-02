import { Component, inject, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { HomeCategories } from "./home-categories/home-categories";
import { HomeHero } from "./home-hero/home-hero";

@Component({
  selector: 'home',
  imports: [HomeCategories, HomeHero],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})  
export class Home implements OnInit {
  private viewportScroller = inject(ViewportScroller);
  
  constructor() {}

  ngOnInit(): void {
    this.scrollToTopOnInit();
  }

  private scrollToTopOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
