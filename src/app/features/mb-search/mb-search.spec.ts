import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbSearch } from './mb-search';

describe('MbSearch', () => {
  let component: MbSearch;
  let fixture: ComponentFixture<MbSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
