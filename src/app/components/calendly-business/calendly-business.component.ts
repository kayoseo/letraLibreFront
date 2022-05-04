import { Component, ElementRef, OnInit, ViewChild,VERSION } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-calendly-business',
  templateUrl: './calendly-business.component.html',
  styleUrls: ['./calendly-business.component.css']
})
export class CalendlyBusinessComponent implements OnInit {
  @ViewChild('container', { static: true }) container: ElementRef;
  name: any;
  email: any;
  rut:any;
  phone:any;

  constructor(private _route: ActivatedRoute) {
  
   }
  
  ngOnInit(){
    this._route.params.subscribe((params: Params) => {
      this.name = params.name;
      this.email = params.email;
      this.rut=params.rut;
      this.phone=params.phone;
    });
    //ignorar que no existe el modulo Calendly, este es cargado en index.html y por eso no lo detecta el compilador al pppio
    //@ts-ignore
    Calendly.initInlineWidget({
      url: 'https://calendly.com/entrevistasempresas/letralibre',
      parentElement:document.querySelector('.calendly-inline-widget'),
      prefill: {
          name: this.name,
          email: this.email,
          customAnswers: {
            a1:this.rut,
            a2:this.phone
          }
      }         
  })}


}
