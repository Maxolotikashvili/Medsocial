import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceduresList } from './procedures-list';

describe('ProceduresList', () => {
  let component: ProceduresList;
  let fixture: ComponentFixture<ProceduresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProceduresList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProceduresList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
