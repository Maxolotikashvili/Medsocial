import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Statcard } from './statcard';

describe('Statcard', () => {
  let component: Statcard;
  let fixture: ComponentFixture<Statcard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statcard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Statcard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
