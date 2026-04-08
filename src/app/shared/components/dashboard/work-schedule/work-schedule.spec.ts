import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSchedule } from './work-schedule';

describe('WorkSchedule', () => {
  let component: WorkSchedule;
  let fixture: ComponentFixture<WorkSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
