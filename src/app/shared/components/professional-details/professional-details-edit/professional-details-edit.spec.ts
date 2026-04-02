import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalDetailsEdit } from './professional-details-edit';

describe('ProfessionalDetailsEdit', () => {
  let component: ProfessionalDetailsEdit;
  let fixture: ComponentFixture<ProfessionalDetailsEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalDetailsEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalDetailsEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
