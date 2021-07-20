import { TestBed } from '@angular/core/testing';

import { CountryPhoneNumbersService } from './country-phone-numbers.service';

describe('CountryPhoneNumbersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountryPhoneNumbersService = TestBed.get(CountryPhoneNumbersService);
    expect(service).toBeTruthy();
  });
});
