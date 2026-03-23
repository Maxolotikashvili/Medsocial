import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbDropdown } from './mb-dropdown';

describe('MbDropdown', () => {
  let component: MbDropdown;
  let fixture: ComponentFixture<MbDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
