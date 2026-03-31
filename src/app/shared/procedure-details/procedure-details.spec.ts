import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureDetails } from './procedure-details';

describe('ProcedureDetails', () => {
  let component: ProcedureDetails;
  let fixture: ComponentFixture<ProcedureDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
