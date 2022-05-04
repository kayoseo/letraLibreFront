import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PowerAppService {
  public headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private _http:HttpClient) { }

  enviarConfirmacion(par): Observable<any> {
    let params = JSON.stringify(par);
    return this._http.post('https://prod-24.brazilsouth.logic.azure.com:443/workflows/dc8747207fb24638b5693b27e925b6c2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hV3_JyxMObkYN2_uKOTtLsDoc1i7UtyT7NJP_C1uJ4c', params, { headers: this.headers });
  }
}
