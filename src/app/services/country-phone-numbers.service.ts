import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryPhoneNumbersService {

  constructor(private _http:HttpClient) { 

  }

  getCountrys()
  {
    return this._http.get("https://restcountries.eu/rest/v2/all?fields=name;callingCodes");
  }
}
