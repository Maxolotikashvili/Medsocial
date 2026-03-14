import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbCheckbox } from './mb-checkbox';

describe('MbCheckbox', () => {
  let component: MbCheckbox;
  let fixture: ComponentFixture<MbCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbCheckbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbCheckbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
