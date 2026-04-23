import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsProcedures } from './doctors-procedures';

describe('DoctorsProcedures', () => {
  let component: DoctorsProcedures;
  let fixture: ComponentFixture<DoctorsProcedures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsProcedures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsProcedures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
