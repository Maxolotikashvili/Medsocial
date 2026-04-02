import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalInfo } from './professional-info';

describe('ProfessionalInfo', () => {
  let component: ProfessionalInfo;
  let fixture: ComponentFixture<ProfessionalInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
