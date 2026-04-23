import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbTextarea } from './mb-textarea';

describe('MbTextarea', () => {
  let component: MbTextarea;
  let fixture: ComponentFixture<MbTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbTextarea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
