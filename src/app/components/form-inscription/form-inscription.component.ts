import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CountryPhoneNumbersService } from 'src/app/services/country-phone-numbers.service';
import { SalesforceService } from 'src/app/services/salesforce.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CalendlyComponent } from '../calendly/calendly.component';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-inscription',
  templateUrl: './form-inscription.component.html',
  styleUrls: ['./form-inscription.component.css']
})
export class FormInscriptionComponent implements OnInit {
  user: any;
  countrys: any;


  constructor(private formBuilder: FormBuilder, private router: Router,
    private _countryPhoneNumbersService: CountryPhoneNumbersService, private _salesforceService: SalesforceService) {
    var patternMail = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    this.user = this.formBuilder.group({
      oid: [ environment.oid],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(patternMail)]],
      emailRepeat: ['', [Validators.required, Validators.pattern(patternMail)]],
      rut: ['', [Validators.required, Validators.minLength(9)]],
      company: ['Tutor Letra Libre'],
      recordType: ['Tutor'],
      country: ["Chile", Validators.required],
      city: ["", Validators.required],
      hasPreviousExperience: [false],
      previousExperience: [null],
      isForeign: [false],
      birthday: ['', Validators.required],
      phoneNumber: ['+56', Validators.required],
      occupation: ["", Validators.required],
      otherOccupation: [null],
      studyHouse: ["", Validators.required],
      otherStudyHouse: [null],
      reasonForAplication: ["", Validators.required],
      candidateOrigin: ["", Validators.required],
      applicationCommitment: [false, Validators.requiredTrue]

    });

    console.log(this.user);
    this.countrys = [];


  }


  ngOnInit() {
    this._countryPhoneNumbersService.getCountrys().subscribe((result) => {
      this.countrys = result;
    });


  }

  checkRut(rut) {
    console.log("rut" + rut);
    // Despejar Puntos
    var rut = this.user.controls['rut'].value;
    var valor = rut.replace('.', '');
    // Despejar Guión
    valor = valor.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    var cuerpo = valor.slice(0, -1);
    var dv = valor.slice(-1).toUpperCase();

    // Formatear RUN
    rut = cuerpo + '-' + dv
    this.user.controls.rut.setValue(rut);


    // Si no cumple con el mínimo ej. (n.nnn.nnn)
    if (cuerpo.length < 7) { /* rut.setCustomValidity("RUT Incompleto"); */ return false; }

    // Calcular Dígito Verificador
    var suma = 0;
    var multiplo = 2;

    // Para cada dígito del Cuerpo
    for (var i = 1; i <= cuerpo.length; i++) {

      // Obtener su Producto con el Múltiplo Correspondiente
      var index = multiplo * valor.charAt(cuerpo.length - i);

      // Sumar al Contador General
      suma = suma + index;

      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }

    }

    // Calcular Dígito Verificador en base al Módulo 11
    var dvEsperado = 11 - (suma % 11);

    // Casos Especiales (0 y K)
    dv = (dv == 'K') ? 10 : dv;
    dv = (dv == 0) ? 11 : dv;

    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado != dv) {
      /* rut.setCustomValidity("RUT Inválido"); */
      this.user.controls.rut.setErrors({ 'incorrect': true });
      return false;
    }

    // Si todo sale bien, eliminar errores (decretar que es válido)
    /* rut.setCustomValidity(''); */
  }

  addCodeTelephone(callingCodes) {
    this.user.controls.phoneNumber.setValue("+" + callingCodes);
  }

  age() {
    var fecha = this.user.controls.birthday.value;
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    if (edad < 18) {
      this.user.controls.birthday.setErrors({ 'incorrect': true });
    }
    return edad;
  }

  /* Cuando cambio el formato de la hora a la chilena debo volver a convertirla a mm/dd
ya que o sino el datepicker la considera como invalida y guarda un null */
  formatFromDate(value) {
    var date = value.split('/');
    value = date[1] + "/" + date[0] + "/" + date[2];
    this.user.controls['birthday'].setValue(new Date(value));

  }


  verificationEmail(value) {
   /*  value = this.user.controls.emailRepeat.value; */
    var email = this.user.controls.email.value;
    if (value != email) {
      this.user.controls.emailRepeat.setErrors({ 'incorrect': true });
    }
  }

  reviewCommitment() {
    /*  if(this.user.controls.applicationCommitment.value==false)
     {
       this.user.controls.applicationCommitment.setErrors({ 'incorrect': true });
     }; */



  }

  submit() {
    

    let body = new URLSearchParams();
    //test
    //body.set('oid', "00D2f0000008gFV");
    //produccion
    body.set('oid', "00D5e000000HFMh");

    body.set('retURL', "http://www.letralibre.cl");
    body.set('first_name', this.user.value.first_name);
    body.set('last_name', this.user.value.last_name);
    body.set('phone', this.user.value.phoneNumber);
    body.set('email', this.user.value.email);
    body.set('city', this.user.value.city);
    body.set('country', this.user.value.country);
    body.set('lead_source', this.user.value.candidateOrigin);
    body.set('company', "Tutor Letra Libre");
    body.set('recordType', "Tutor");
    body.set('submit', "Enviar");
    body.set('debug', "1");
    body.set('debugEmail', "juanromanmontes@gmail.com");


    //no tengo rut chileno
    if (this.user.value.isForeign) {
      //test
      /* body.set['00N2f000001Eimu'] = 1; */
      //produccion
      body.set('00N5e00000N8lnm', "1");
    }
    //test
    //body.set('00N2f000001Eimp',this.user.value.rut );
    //produccion
    body.set('00N5e00000N8lnr', this.user.value.rut);

    //test
    // body.set('00N2f000001Eimz',this.user.value.birthday);
    //produccion
    body.set('00N5e00000N8lnh', moment(this.user.value.birthday).format("DD/MM/YYYY").toString());

    //test
  /*   body.set('00N2f000001EinE', this.user.value.occupation); */
    //produccion
    body.set('00N5e00000N8lnn', this.user.value.occupation);

    if (this.user.value.otherOccupation != null) {
      //test
      //body.set('00N2f000001EinJ',this.user.value.otherOccupation);
      //produccion
      body.set('00N5e00000N8lnq', this.user.value.otherOccupation);
    }

    //test
    //body.set('00N2f000001EinO',this.user.value.studyHouse ); 
    //produccion
    body.set('00N5e00000N8lna', this.user.value.studyHouse);

    if (this.user.value.otherStudyHouse != null) {
      //test
      //body.set('00N2f000001EinT',this.user.value.otherStudyHouse);
      //produccion
      body.set('00N5e00000N8lnp', this.user.value.otherStudyHouse);
    }

    if (this.user.value.hasPreviousExperience) {
      //test
      //body.set('00N2f000001Eind',"1"); 
      //produccion
      body.set('00N5e00000N8lns', "1");

      //test
      //body.set('00N2f000001EinY',this.user.value.previousExperience);
      //produccion
      body.set('00N5e00000N8lng', this.user.value.previousExperience);
    }

    //test
    //body.set('00N2f000001Eini',this.user.value.reasonForAplication);
    //produccion
    body.set('00N5e00000N8lnl', this.user.value.reasonForAplication);



    if (this.user.value.applicationCommitment) {
      //test
      //body.set('00N2f000001Einn', "1");
      //produccion
      body.set('00N5e00000N8lnb', "1");
    }

    this._salesforceService.saveVoluntary(body).subscribe((response) => {
      console.log(response);
    },
      error => {
        console.log(error);
      });
    this.router.navigate(['/agendamiento/' + this.user.value.first_name + ' ' + this.user.value.last_name + '/' + this.user.value.email + '/' + this.user.value.rut+'/'+this.user.value.phoneNumber]);
  }

}
