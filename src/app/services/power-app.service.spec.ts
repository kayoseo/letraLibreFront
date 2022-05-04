import { TestBed } from '@angular/core/testing';

import { PowerAppService } from './power-app.service';

describe('PowerAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PowerAppService = TestBed.get(PowerAppService);
    expect(service).toBeTruthy();
  });
});
