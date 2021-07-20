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
/*       let body = new URLSearchParams();
body.set('oid',"00D2f0000008gFV" );
body.set('retURL',"http://www.letralibre.cl" );
body.set('first_name',"prueba" );
body.set('last_name',"prueba" );
body.set('00N2f000001Eimp',"8534359-9" );
body.set('00N2f000001Eimz',"1992-11-03T03:00:00.000Z" );
 body.set('phone',"+56" );
body.set('email','juan.roman@letralibre.cl' );
body.set('city',"prueba" );
body.set('country',"Chile" ); 
body.set('company',"Tutor Letra Libre" ); 
body.set('recordType',"Tutor" ); 
body.set('submit',"Enviar" ); 
body.set('00N2f000001EinE',"Dueña/o de casa" ); 
body.set('00N2f000001EinO',"DUOC UC" ); 
body.set('00N2f000001Eini',"prueba" ); 
body.set('debug',"1" ); 
body.set('debugEmail',"juanromanmontes@gmail.com" ); */

/* oid: "00D5e000000HFMh"
retURL: "http://www.letralibre.cl"
first_name: "prueba"
last_name: "prueba"
00N5e00000N8lnr: "8534359-9"
00N2f000001Eimz: "1992-11-03T03:00:00.000Z"
phone: "+56"
email: "jroman@amisoft.cl"
city: "prueba"
country: "Chile"
00N2f000001EinE: "Dueña/o de casa"
00N2f000001EinO: "DUOC UC"
00N2f000001Eini: "prueba"
lead_source: "Twitter"
company: "Tutor Letra Libre"
recordType: "Tutor"
submit: "Enviar"
00N2f000001Einn: "1"  */
  /*   let params=JSON.stringify(body);  */

  //test
    /* return this._http.post<any>("https://test.salesforce.com/servlet/servlet.WebToLead",par.toString(),{headers:httpheaders,params: {encoding:"UTF-8" }}); */
  //produccion
  return this._http.post<any>("https://webto.salesforce.com/servlet/servlet.WebToLead",par.toString(),{headers:httpheaders,params: {encoding:"UTF-8" }});
  }
}
