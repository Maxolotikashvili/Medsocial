import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorHeader } from './doctor-header';

describe('DoctorHeader', () => {
  let component: DoctorHeader;
  let fixture: ComponentFixture<DoctorHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
