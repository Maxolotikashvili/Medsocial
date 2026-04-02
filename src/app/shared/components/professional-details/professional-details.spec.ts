import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalDetails } from './professional-details';

describe('ProfessionalDetails', () => {
  let component: ProfessionalDetails;
  let fixture: ComponentFixture<ProfessionalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
