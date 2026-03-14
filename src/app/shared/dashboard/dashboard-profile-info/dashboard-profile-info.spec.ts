import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProfileInfo } from './dashboard-profile-info';

describe('DashboardProfileInfo', () => {
  let component: DashboardProfileInfo;
  let fixture: ComponentFixture<DashboardProfileInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProfileInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProfileInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
