import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbInput } from './mb-input';

describe('MbInput', () => {
  let component: MbInput;
  let fixture: ComponentFixture<MbInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
