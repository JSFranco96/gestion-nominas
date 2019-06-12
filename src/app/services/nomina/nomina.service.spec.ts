import { TestBed } from '@angular/core/testing';

import { NominaService } from './nomina.service';

describe('NominaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NominaService = TestBed.get(NominaService);
    expect(service).toBeTruthy();
  });
});
