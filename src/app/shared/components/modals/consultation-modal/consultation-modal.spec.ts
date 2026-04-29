import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationModal } from './consultation-modal';

describe('ConsultationModal', () => {
  let component: ConsultationModal;
  let fixture: ComponentFixture<ConsultationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
