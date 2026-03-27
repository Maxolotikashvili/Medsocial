import { TestBed } from '@angular/core/testing';

import { ProceduresFilter } from './procedures-filter.service';

describe('ProceduresFilter', () => {
  let service: ProceduresFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProceduresFilter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
