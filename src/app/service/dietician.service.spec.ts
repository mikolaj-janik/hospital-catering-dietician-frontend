import { TestBed } from '@angular/core/testing';

import { DieticianService } from './dietician.service';

describe('DieticianService', () => {
  let service: DieticianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DieticianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
