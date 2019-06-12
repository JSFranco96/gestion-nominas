import { TestBed } from '@angular/core/testing';

import { IngresoService } from './ingreso.service';

describe('IngresoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IngresoService = TestBed.get(IngresoService);
    expect(service).toBeTruthy();
  });
});
