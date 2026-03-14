import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbSwitch } from './mb-switch';

describe('MbSwitch', () => {
  let component: MbSwitch;
  let fixture: ComponentFixture<MbSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbSwitch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
