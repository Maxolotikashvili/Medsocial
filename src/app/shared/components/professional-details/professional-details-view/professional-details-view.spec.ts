import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalDetailsView } from './professional-details-view';

describe('ProfessionalDetailsView', () => {
  let component: ProfessionalDetailsView;
  let fixture: ComponentFixture<ProfessionalDetailsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalDetailsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalDetailsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
