import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesforceService {
   public headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');  


  constructor(private _http:HttpClient) { }

  saveVoluntary(par:URLSearchParams):Observable<any>
  {
var httpheaders = new HttpHeaders(
      {
         'Content-type': 'application/x-www-form-urlencoded', 
         /* 'Origin':null, */
        'Accept': '*/*', 
       /*  'Accept-Encoding': 'gzip, deflate, br' */
      });


  //test
    /* return this._http.post<any>("https://test.salesforce.com/servlet/servlet.WebToLead",par.toString(),{headers:httpheaders,params: {encoding:"UTF-8" }}); */
  //produccion
  return this._http.post<any>("https://webto.salesforce.com/servlet/servlet.WebToLead",par.toString(),{headers:httpheaders,params: {encoding:"UTF-8" }});
  }

  saveVoluntaryBussines(par:URLSearchParams):Observable<any>
  {
var httpheaders = new HttpHeaders(
      {
         'Content-type': 'application/x-www-form-urlencoded', 
         /* 'Origin':null, */
        'Accept': '*/*', 
       /*  'Accept-Encoding': 'gzip, deflate, br' */
      });


  //test
    /* return this._http.post<any>("https://test.salesforce.com/servlet/servlet.WebToLead",par.toString(),{headers:httpheaders,params: {encoding:"UTF-8" }}); */
  //produccion
  return this._http.post<any>("https://webto.salesforce.com/servlet/servlet.WebToLead",par.toString(),{headers:httpheaders,params: {encoding:"UTF-8" }});
  }
}
