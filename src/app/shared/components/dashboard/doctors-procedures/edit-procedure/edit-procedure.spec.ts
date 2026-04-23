import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProcedure } from './edit-procedure';

describe('EditProcedure', () => {
  let component: EditProcedure;
  let fixture: ComponentFixture<EditProcedure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProcedure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProcedure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
