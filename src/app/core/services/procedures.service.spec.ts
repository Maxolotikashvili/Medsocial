import { TestBed } from '@angular/core/testing';
import { Procedures } from './procedures.service';

describe('Procedures', () => {
  let service: Procedures;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Procedures);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
