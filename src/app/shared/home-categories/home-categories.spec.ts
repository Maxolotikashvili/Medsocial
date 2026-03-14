import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCategories } from './home-categories';

describe('HomeCategories', () => {
  let component: HomeCategories;
  let fixture: ComponentFixture<HomeCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
