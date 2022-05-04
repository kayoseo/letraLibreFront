import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CountryPhoneNumbersService } from 'src/app/services/country-phone-numbers.service';
import { SalesforceService } from 'src/app/services/salesforce.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CalendlyComponent } from '../calendly/calendly.component';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-inscription-business',
  templateUrl: './form-inscription-business.component.html',
  styleUrls: ['./form-inscription-business.component.css']
})
export class FormInscriptionBusinessComponent implements OnInit {
  user: any;
  countrys: any;


  constructor(private formBuilder: FormBuilder, private router: Router,
    private _countryPhoneNumbersService: CountryPhoneNumbersService, private _salesforceService: SalesforceService) {
    var patternMail = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    this.user = this.formBuilder.group({
      oid: [environment.oid],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(patternMail)]],
      emailRepeat: ['', [Validators.required, Validators.pattern(patternMail)]],
      rut: ['', [Validators.required, Validators.minLength(9)]],
      company: ['Tutor Letra Libre'],
      recordType: ['Tutor'],
      country: ["Chile", Validators.required],
      city: [""],
      region: [""],
      comuna: [""],
      genero: [""],
      hasPreviousExperience: [false],
      previousExperience: [null],
      isForeign: [false],
      birthday: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(7)]],
      occupation: [""],
      otherOccupation: [null],
      studyHouse: [""],
      otherStudyHouse: [null],
      reasonForAplication: ["", Validators.required],
      candidateOrigin: [""],
      applicationCommitment: [false, Validators.requiredTrue],
      entryGroup: ["", Validators.required],
      relationshipEntryGroup: ["", Validators.required]

    });
    this.countrys = [];
  }


  ngOnInit() {
    /*   this._countryPhoneNumbersService.getCountrys().subscribe((result) => {
        this.countrys = result;
      }); */
    this.countrys = this.paises;
  }

  checkRut(rut) {
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
    if (this.user.controls.phoneNumber.value == "") {
      this.user.controls.phoneNumber.setValue("+" + callingCodes);
    }
  }

  age() {
    var fecha = this.user.controls.birthday.value;
    var hoy = new Date();
    var fecha = fecha.split('/');
    if (fecha[2]) {
      if (fecha[2].length < 4 || fecha[2].length > 4) {
        this.user.controls.birthday.setErrors({ 'invalido': true });
        //asi evito que aparezca la otra validacion
        return 18;
      }
    }
    else {
      this.user.controls.birthday.setErrors({ 'invalido': true });
      //asi evito que aparezca la otra validacion
      return 18;
    }

    var value = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
    var cumpleanos = new Date(value);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();
    console.log("cumpleaños", cumpleanos);
    if (cumpleanos.toString() == "Invalid Date") {
      this.user.controls.birthday.setErrors({ 'invalido': true });
      //asi evito que aparezca la otra validacion
      return 18;
    }

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

  replaceGuion(value) {
    if (value.length == 2 || value.length == 5) {
      value = value + "/";
    }
    value = value.replace('-', '/');
    this.user.controls['birthday'].setValue(value);
  }


  removeSpace(value) {
    value = value.replace(" ", "").toLowerCase();
    this.user.controls['email'].setValue(value.toLowerCase());
    var emailRepeat = this.user.controls.emailRepeat.value;
    if (value != emailRepeat) {
      console.log("son diferentes");
      this.user.controls.emailRepeat.setErrors({ 'incorrect': true });
    }
    else {
      console.log("son iguales");
      if (!this.user.controls['emailRepeat'].errors.pattern) {
        this.user.controls.emailRepeat.setErrors(null);
      }
    }

  }

  verificationEmail(value) {
    /*  value = this.user.controls.emailRepeat.value; */
    value = value.replace(" ", "").toLowerCase();
    this.user.controls['emailRepeat'].setValue(value);
    var email = this.user.controls.email.value;

    if (value.toLowerCase() != email.toLowerCase()) {
      this.user.controls.emailRepeat.setErrors({ 'incorrect': true });
    }
    else {
      if (!this.user.controls['emailRepeat'].errors.pattern) {
        this.user.controls.emailRepeat.setErrors(null);
      }


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
    //test nuevo
    /*  body.set('oid', "00D7h000000GzV1"); */
    //test
    /* body.set('oid', "00D2f0000008gFV"); */
    //produccion
    body.set('oid', "00D5e000000HFMh");

    body.set('retURL', "http://www.letralibre.cl");
    body.set('first_name', this.user.value.first_name);
    body.set('last_name', this.user.value.last_name);
    body.set('phone', this.user.value.phoneNumber);
    body.set('email', this.user.value.email);
    body.set('00N5e00000f4HHh', this.user.value.country);
    if (this.user.value.country != "Chile") {
      body.set('city', this.user.value.city);
    }
    else {
      body.set('00N5e00000f3LKo', this.user.value.region);
      body.set('00N5e00000f3LKh', this.user.value.comuna);
    }
    body.set('00N5e00000f4Fxg', this.user.value.genero);
    body.set('lead_source', this.user.value.candidateOrigin);
    body.set('company', "Tutor Letra Libre");
    body.set('recordType', "Tutor");
    body.set('submit', "Enviar");
    body.set('debug', "1");
    //ultimos dos test
    /* body.set('00N7h000003zNCf', this.user.value.entryGroup); */
    //prod 00N5e00000Y3oPK
    body.set('00N5e00000Y3oPK', this.user.value.entryGroup);
    //prod
    body.set('00N5e00000Y3oPL', this.user.value.relationshipEntryGroup);
    //test
    /* body.set('00N7h000003zND9', this.user.value.relationshipEntryGroup); */
    body.set('debugEmail', "felipe.ferreira@letralibre.cl");


    //no tengo rut chileno
    if (this.user.value.isForeign) {
      //test
      /* body.set['00N2f000001Eimu'] = 1; */
      //produccion
      body.set('00N5e00000N8lnm', "1");
    }
    //test
    /* body.set('00N2f000001Eimp', this.user.value.rut); */
    //produccion
    body.set('00N5e00000N8lnr', this.user.value.rut);

    var fecha = this.user.value.birthday.split('/');
    var value = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
    var cumpleanos = new Date(value);
    //test
    /* body.set('00N2f000001Eimz', moment(this.user.value.birthday).format("DD/MM/YYYY").toString()); */
    //produccion
    body.set('00N5e00000N8lnh', moment(cumpleanos).format("DD/MM/YYYY").toString());

    //test
    /* body.set('00N2f000001EinE', this.user.value.occupation); */
    //produccion
    body.set('00N5e00000N8lnn', this.user.value.occupation);

    if (this.user.value.otherOccupation != null) {
      //test
      body.set('00N2f000001EinJ', this.user.value.otherOccupation);
      //produccion
      /* body.set('00N5e00000N8lnq', this.user.value.otherOccupation); */
    }

    //test
    /* body.set('00N2f000001EinO', this.user.value.studyHouse); */
    //produccion
    body.set('00N5e00000N8lna', this.user.value.studyHouse);

    if (this.user.value.otherStudyHouse != null) {
      //test
      body.set('00N2f000001EinT', this.user.value.otherStudyHouse);
      //produccion
      /* body.set('00N5e00000N8lnp', this.user.value.otherStudyHouse); */
    }

    if (this.user.value.hasPreviousExperience) {
      //test
      /* body.set('00N2f000001Eind', "1"); */
      //produccion
      body.set('00N5e00000N8lns', "1");

      //test
      /*  body.set('00N2f000001EinY', this.user.value.previousExperience); */
      //produccion
      body.set('00N5e00000N8lng', this.user.value.previousExperience);
    }

    //test
    /* body.set('00N2f000001Eini', this.user.value.reasonForAplication); */
    //produccion
    body.set('00N5e00000N8lnl', this.user.value.reasonForAplication);



    if (this.user.value.applicationCommitment) {
      //test nuevo
      body.set('00N5e00000N8lnd', "1");
      //test
      /*  body.set('00N2f000001Einn', "1"); */
      //produccion
      /* body.set('00N5e00000N8lnb', "1"); */
    }

    this._salesforceService.saveVoluntaryBussines(body).subscribe((response) => {
      console.log(response);
      //window.location.href = 'https://www.letralibre.cl/inscripci%C3%B3n-especial-confirmada';
      this.router.navigate(['/agendamiento-empresas/' + this.user.value.first_name + ' ' + this.user.value.last_name + '/' + this.user.value.email + '/' + this.user.value.rut + '/' + this.user.value.phoneNumber]);
      //this.alertaInscripcion();
    },
      error => {
        console.log(error);
       // window.location.href = 'https://www.letralibre.cl/inscripci%C3%B3n-especial-confirmada';
       this.router.navigate(['/agendamiento-empresas/' + this.user.value.first_name + ' ' + this.user.value.last_name + '/' + this.user.value.email + '/' + this.user.value.rut + '/' + this.user.value.phoneNumber]);
      });

  }


  alertaInscripcion() {
    Swal.fire(
      'Felicidades, te has inscrito correctamente!',
      'Pronto te contactaremos',
      'success'
    ).then(result => {
      window.location.href = 'http://letralibre.cl';
    })
  }

  comunas = [];

  addComunas(comunas) {
    let equalizables = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'nz' }

    this.comunas = comunas.sort((a, b) => a.toLowerCase().replace(new RegExp(Object.keys(equalizables).join('|'), 'g'), (match) => equalizables[match]) > b.toLowerCase().replace(new RegExp(Object.keys(equalizables).join('|'), 'g'), (match) => equalizables[match]) ? 1 : -1);
  }

  paises = [
    {
      "nombre": "Afganistán",
      "name": "Afghanistan",
      "nom": "Afghanistan",
      "iso2": "AF",
      "iso3": "AFG",
      "phone_code": "93"
    },
    {
      "nombre": "Albania",
      "name": "Albania",
      "nom": "Albanie",
      "iso2": "AL",
      "iso3": "ALB",
      "phone_code": "355"
    },
    {
      "nombre": "Alemania",
      "name": "Germany",
      "nom": "Allemagne",
      "iso2": "DE",
      "iso3": "DEU",
      "phone_code": "49"
    },
    {
      "nombre": "Andorra",
      "name": "Andorra",
      "nom": "Andorra",
      "iso2": "AD",
      "iso3": "AND",
      "phone_code": "376"
    },
    {
      "nombre": "Angola",
      "name": "Angola",
      "nom": "Angola",
      "iso2": "AO",
      "iso3": "AGO",
      "phone_code": "244"
    },
    {
      "nombre": "Anguila",
      "name": "Anguilla",
      "nom": "Anguilla",
      "iso2": "AI",
      "iso3": "AIA",
      "phone_code": "1 264"
    },
    {
      "nombre": "Antártida",
      "name": "Antarctica",
      "nom": "L'Antarctique",
      "iso2": "AQ",
      "iso3": "ATA",
      "phone_code": "672"
    },
    {
      "nombre": "Antigua y Barbuda",
      "name": "Antigua and Barbuda",
      "nom": "Antigua et Barbuda",
      "iso2": "AG",
      "iso3": "ATG",
      "phone_code": "1 268"
    },
    {
      "nombre": "Arabia Saudita",
      "name": "Saudi Arabia",
      "nom": "Arabie Saoudite",
      "iso2": "SA",
      "iso3": "SAU",
      "phone_code": "966"
    },
    {
      "nombre": "Argelia",
      "name": "Algeria",
      "nom": "Algérie",
      "iso2": "DZ",
      "iso3": "DZA",
      "phone_code": "213"
    },
    {
      "nombre": "Argentina",
      "name": "Argentina",
      "nom": "Argentine",
      "iso2": "AR",
      "iso3": "ARG",
      "phone_code": "54"
    },
    {
      "nombre": "Armenia",
      "name": "Armenia",
      "nom": "L'Arménie",
      "iso2": "AM",
      "iso3": "ARM",
      "phone_code": "374"
    },
    {
      "nombre": "Aruba",
      "name": "Aruba",
      "nom": "Aruba",
      "iso2": "AW",
      "iso3": "ABW",
      "phone_code": "297"
    },
    {
      "nombre": "Australia",
      "name": "Australia",
      "nom": "Australie",
      "iso2": "AU",
      "iso3": "AUS",
      "phone_code": "61"
    },
    {
      "nombre": "Austria",
      "name": "Austria",
      "nom": "Autriche",
      "iso2": "AT",
      "iso3": "AUT",
      "phone_code": "43"
    },
    {
      "nombre": "Azerbaiyán",
      "name": "Azerbaijan",
      "nom": "L'Azerbaïdjan",
      "iso2": "AZ",
      "iso3": "AZE",
      "phone_code": "994"
    },
    {
      "nombre": "Bélgica",
      "name": "Belgium",
      "nom": "Belgique",
      "iso2": "BE",
      "iso3": "BEL",
      "phone_code": "32"
    },
    {
      "nombre": "Bahamas",
      "name": "Bahamas",
      "nom": "Bahamas",
      "iso2": "BS",
      "iso3": "BHS",
      "phone_code": "1 242"
    },
    {
      "nombre": "Bahrein",
      "name": "Bahrain",
      "nom": "Bahreïn",
      "iso2": "BH",
      "iso3": "BHR",
      "phone_code": "973"
    },
    {
      "nombre": "Bangladesh",
      "name": "Bangladesh",
      "nom": "Bangladesh",
      "iso2": "BD",
      "iso3": "BGD",
      "phone_code": "880"
    },
    {
      "nombre": "Barbados",
      "name": "Barbados",
      "nom": "Barbade",
      "iso2": "BB",
      "iso3": "BRB",
      "phone_code": "1 246"
    },
    {
      "nombre": "Belice",
      "name": "Belize",
      "nom": "Belize",
      "iso2": "BZ",
      "iso3": "BLZ",
      "phone_code": "501"
    },
    {
      "nombre": "Benín",
      "name": "Benin",
      "nom": "Bénin",
      "iso2": "BJ",
      "iso3": "BEN",
      "phone_code": "229"
    },
    {
      "nombre": "Bhután",
      "name": "Bhutan",
      "nom": "Le Bhoutan",
      "iso2": "BT",
      "iso3": "BTN",
      "phone_code": "975"
    },
    {
      "nombre": "Bielorrusia",
      "name": "Belarus",
      "nom": "Biélorussie",
      "iso2": "BY",
      "iso3": "BLR",
      "phone_code": "375"
    },
    {
      "nombre": "Birmania",
      "name": "Myanmar",
      "nom": "Myanmar",
      "iso2": "MM",
      "iso3": "MMR",
      "phone_code": "95"
    },
    {
      "nombre": "Bolivia",
      "name": "Bolivia",
      "nom": "Bolivie",
      "iso2": "BO",
      "iso3": "BOL",
      "phone_code": "591"
    },
    {
      "nombre": "Bosnia y Herzegovina",
      "name": "Bosnia and Herzegovina",
      "nom": "Bosnie-Herzégovine",
      "iso2": "BA",
      "iso3": "BIH",
      "phone_code": "387"
    },
    {
      "nombre": "Botsuana",
      "name": "Botswana",
      "nom": "Botswana",
      "iso2": "BW",
      "iso3": "BWA",
      "phone_code": "267"
    },
    {
      "nombre": "Brasil",
      "name": "Brazil",
      "nom": "Brésil",
      "iso2": "BR",
      "iso3": "BRA",
      "phone_code": "55"
    },
    {
      "nombre": "Brunéi",
      "name": "Brunei",
      "nom": "Brunei",
      "iso2": "BN",
      "iso3": "BRN",
      "phone_code": "673"
    },
    {
      "nombre": "Bulgaria",
      "name": "Bulgaria",
      "nom": "Bulgarie",
      "iso2": "BG",
      "iso3": "BGR",
      "phone_code": "359"
    },
    {
      "nombre": "Burkina Faso",
      "name": "Burkina Faso",
      "nom": "Burkina Faso",
      "iso2": "BF",
      "iso3": "BFA",
      "phone_code": "226"
    },
    {
      "nombre": "Burundi",
      "name": "Burundi",
      "nom": "Burundi",
      "iso2": "BI",
      "iso3": "BDI",
      "phone_code": "257"
    },
    {
      "nombre": "Cabo Verde",
      "name": "Cape Verde",
      "nom": "Cap-Vert",
      "iso2": "CV",
      "iso3": "CPV",
      "phone_code": "238"
    },
    {
      "nombre": "Camboya",
      "name": "Cambodia",
      "nom": "Cambodge",
      "iso2": "KH",
      "iso3": "KHM",
      "phone_code": "855"
    },
    {
      "nombre": "Camerún",
      "name": "Cameroon",
      "nom": "Cameroun",
      "iso2": "CM",
      "iso3": "CMR",
      "phone_code": "237"
    },
    {
      "nombre": "Canadá",
      "name": "Canada",
      "nom": "Canada",
      "iso2": "CA",
      "iso3": "CAN",
      "phone_code": "1"
    },
    {
      "nombre": "Chad",
      "name": "Chad",
      "nom": "Tchad",
      "iso2": "TD",
      "iso3": "TCD",
      "phone_code": "235"
    },
    {
      "nombre": "Chile",
      "name": "Chile",
      "nom": "Chili",
      "iso2": "CL",
      "iso3": "CHL",
      "phone_code": "56"
    },
    {
      "nombre": "China",
      "name": "China",
      "nom": "Chine",
      "iso2": "CN",
      "iso3": "CHN",
      "phone_code": "86"
    },
    {
      "nombre": "Chipre",
      "name": "Cyprus",
      "nom": "Chypre",
      "iso2": "CY",
      "iso3": "CYP",
      "phone_code": "357"
    },
    {
      "nombre": "Ciudad del Vaticano",
      "name": "Vatican City State",
      "nom": "Cité du Vatican",
      "iso2": "VA",
      "iso3": "VAT",
      "phone_code": "39"
    },
    {
      "nombre": "Colombia",
      "name": "Colombia",
      "nom": "Colombie",
      "iso2": "CO",
      "iso3": "COL",
      "phone_code": "57"
    },
    {
      "nombre": "Comoras",
      "name": "Comoros",
      "nom": "Comores",
      "iso2": "KM",
      "iso3": "COM",
      "phone_code": "269"
    },
    {
      "nombre": "República del Congo",
      "name": "Republic of the Congo",
      "nom": "République du Congo",
      "iso2": "CG",
      "iso3": "COG",
      "phone_code": "242"
    },
    {
      "nombre": "República Democrática del Congo",
      "name": "Democratic Republic of the Congo",
      "nom": "République démocratique du Congo",
      "iso2": "CD",
      "iso3": "COD",
      "phone_code": "243"
    },
    {
      "nombre": "Corea del Norte",
      "name": "North Korea",
      "nom": "Corée du Nord",
      "iso2": "KP",
      "iso3": "PRK",
      "phone_code": "850"
    },
    {
      "nombre": "Corea del Sur",
      "name": "South Korea",
      "nom": "Corée du Sud",
      "iso2": "KR",
      "iso3": "KOR",
      "phone_code": "82"
    },
    {
      "nombre": "Costa de Marfil",
      "name": "Ivory Coast",
      "nom": "Côte-d'Ivoire",
      "iso2": "CI",
      "iso3": "CIV",
      "phone_code": "225"
    },
    {
      "nombre": "Costa Rica",
      "name": "Costa Rica",
      "nom": "Costa Rica",
      "iso2": "CR",
      "iso3": "CRI",
      "phone_code": "506"
    },
    {
      "nombre": "Croacia",
      "name": "Croatia",
      "nom": "Croatie",
      "iso2": "HR",
      "iso3": "HRV",
      "phone_code": "385"
    },
    {
      "nombre": "Cuba",
      "name": "Cuba",
      "nom": "Cuba",
      "iso2": "CU",
      "iso3": "CUB",
      "phone_code": "53"
    },
    {
      "nombre": "Curazao",
      "name": "Curaçao",
      "nom": "Curaçao",
      "iso2": "CW",
      "iso3": "CWU",
      "phone_code": "5999"
    },
    {
      "nombre": "Dinamarca",
      "name": "Denmark",
      "nom": "Danemark",
      "iso2": "DK",
      "iso3": "DNK",
      "phone_code": "45"
    },
    {
      "nombre": "Dominica",
      "name": "Dominica",
      "nom": "Dominique",
      "iso2": "DM",
      "iso3": "DMA",
      "phone_code": "1 767"
    },
    {
      "nombre": "Ecuador",
      "name": "Ecuador",
      "nom": "Equateur",
      "iso2": "EC",
      "iso3": "ECU",
      "phone_code": "593"
    },
    {
      "nombre": "Egipto",
      "name": "Egypt",
      "nom": "Egypte",
      "iso2": "EG",
      "iso3": "EGY",
      "phone_code": "20"
    },
    {
      "nombre": "El Salvador",
      "name": "El Salvador",
      "nom": "El Salvador",
      "iso2": "SV",
      "iso3": "SLV",
      "phone_code": "503"
    },
    {
      "nombre": "Emiratos Árabes Unidos",
      "name": "United Arab Emirates",
      "nom": "Emirats Arabes Unis",
      "iso2": "AE",
      "iso3": "ARE",
      "phone_code": "971"
    },
    {
      "nombre": "Eritrea",
      "name": "Eritrea",
      "nom": "Erythrée",
      "iso2": "ER",
      "iso3": "ERI",
      "phone_code": "291"
    },
    {
      "nombre": "Eslovaquia",
      "name": "Slovakia",
      "nom": "Slovaquie",
      "iso2": "SK",
      "iso3": "SVK",
      "phone_code": "421"
    },
    {
      "nombre": "Eslovenia",
      "name": "Slovenia",
      "nom": "Slovénie",
      "iso2": "SI",
      "iso3": "SVN",
      "phone_code": "386"
    },
    {
      "nombre": "España",
      "name": "Spain",
      "nom": "Espagne",
      "iso2": "ES",
      "iso3": "ESP",
      "phone_code": "34"
    },
    {
      "nombre": "Estados Unidos de América",
      "name": "United States of America",
      "nom": "États-Unis d'Amérique",
      "iso2": "US",
      "iso3": "USA",
      "phone_code": "1"
    },
    {
      "nombre": "Estonia",
      "name": "Estonia",
      "nom": "L'Estonie",
      "iso2": "EE",
      "iso3": "EST",
      "phone_code": "372"
    },
    {
      "nombre": "Etiopía",
      "name": "Ethiopia",
      "nom": "Ethiopie",
      "iso2": "ET",
      "iso3": "ETH",
      "phone_code": "251"
    },
    {
      "nombre": "Filipinas",
      "name": "Philippines",
      "nom": "Philippines",
      "iso2": "PH",
      "iso3": "PHL",
      "phone_code": "63"
    },
    {
      "nombre": "Finlandia",
      "name": "Finland",
      "nom": "Finlande",
      "iso2": "FI",
      "iso3": "FIN",
      "phone_code": "358"
    },
    {
      "nombre": "Fiyi",
      "name": "Fiji",
      "nom": "Fidji",
      "iso2": "FJ",
      "iso3": "FJI",
      "phone_code": "679"
    },
    {
      "nombre": "Francia",
      "name": "France",
      "nom": "France",
      "iso2": "FR",
      "iso3": "FRA",
      "phone_code": "33"
    },
    {
      "nombre": "Gabón",
      "name": "Gabon",
      "nom": "Gabon",
      "iso2": "GA",
      "iso3": "GAB",
      "phone_code": "241"
    },
    {
      "nombre": "Gambia",
      "name": "Gambia",
      "nom": "Gambie",
      "iso2": "GM",
      "iso3": "GMB",
      "phone_code": "220"
    },
    {
      "nombre": "Georgia",
      "name": "Georgia",
      "nom": "Géorgie",
      "iso2": "GE",
      "iso3": "GEO",
      "phone_code": "995"
    },
    {
      "nombre": "Ghana",
      "name": "Ghana",
      "nom": "Ghana",
      "iso2": "GH",
      "iso3": "GHA",
      "phone_code": "233"
    },
    {
      "nombre": "Gibraltar",
      "name": "Gibraltar",
      "nom": "Gibraltar",
      "iso2": "GI",
      "iso3": "GIB",
      "phone_code": "350"
    },
    {
      "nombre": "Granada",
      "name": "Grenada",
      "nom": "Grenade",
      "iso2": "GD",
      "iso3": "GRD",
      "phone_code": "1 473"
    },
    {
      "nombre": "Grecia",
      "name": "Greece",
      "nom": "Grèce",
      "iso2": "GR",
      "iso3": "GRC",
      "phone_code": "30"
    },
    {
      "nombre": "Groenlandia",
      "name": "Greenland",
      "nom": "Groenland",
      "iso2": "GL",
      "iso3": "GRL",
      "phone_code": "299"
    },
    {
      "nombre": "Guadalupe",
      "name": "Guadeloupe",
      "nom": "Guadeloupe",
      "iso2": "GP",
      "iso3": "GLP",
      "phone_code": "590"
    },
    {
      "nombre": "Guam",
      "name": "Guam",
      "nom": "Guam",
      "iso2": "GU",
      "iso3": "GUM",
      "phone_code": "1 671"
    },
    {
      "nombre": "Guatemala",
      "name": "Guatemala",
      "nom": "Guatemala",
      "iso2": "GT",
      "iso3": "GTM",
      "phone_code": "502"
    },
    {
      "nombre": "Guayana Francesa",
      "name": "French Guiana",
      "nom": "Guyane française",
      "iso2": "GF",
      "iso3": "GUF",
      "phone_code": "594"
    },
    {
      "nombre": "Guernsey",
      "name": "Guernsey",
      "nom": "Guernesey",
      "iso2": "GG",
      "iso3": "GGY",
      "phone_code": "44"
    },
    {
      "nombre": "Guinea",
      "name": "Guinea",
      "nom": "Guinée",
      "iso2": "GN",
      "iso3": "GIN",
      "phone_code": "224"
    },
    {
      "nombre": "Guinea Ecuatorial",
      "name": "Equatorial Guinea",
      "nom": "Guinée Equatoriale",
      "iso2": "GQ",
      "iso3": "GNQ",
      "phone_code": "240"
    },
    {
      "nombre": "Guinea-Bissau",
      "name": "Guinea-Bissau",
      "nom": "Guinée-Bissau",
      "iso2": "GW",
      "iso3": "GNB",
      "phone_code": "245"
    },
    {
      "nombre": "Guyana",
      "name": "Guyana",
      "nom": "Guyane",
      "iso2": "GY",
      "iso3": "GUY",
      "phone_code": "592"
    },
    {
      "nombre": "Haití",
      "name": "Haiti",
      "nom": "Haïti",
      "iso2": "HT",
      "iso3": "HTI",
      "phone_code": "509"
    },
    {
      "nombre": "Honduras",
      "name": "Honduras",
      "nom": "Honduras",
      "iso2": "HN",
      "iso3": "HND",
      "phone_code": "504"
    },
    {
      "nombre": "Hong kong",
      "name": "Hong Kong",
      "nom": "Hong Kong",
      "iso2": "HK",
      "iso3": "HKG",
      "phone_code": "852"
    },
    {
      "nombre": "Hungría",
      "name": "Hungary",
      "nom": "Hongrie",
      "iso2": "HU",
      "iso3": "HUN",
      "phone_code": "36"
    },
    {
      "nombre": "India",
      "name": "India",
      "nom": "Inde",
      "iso2": "IN",
      "iso3": "IND",
      "phone_code": "91"
    },
    {
      "nombre": "Indonesia",
      "name": "Indonesia",
      "nom": "Indonésie",
      "iso2": "ID",
      "iso3": "IDN",
      "phone_code": "62"
    },
    {
      "nombre": "Irán",
      "name": "Iran",
      "nom": "Iran",
      "iso2": "IR",
      "iso3": "IRN",
      "phone_code": "98"
    },
    {
      "nombre": "Irak",
      "name": "Iraq",
      "nom": "Irak",
      "iso2": "IQ",
      "iso3": "IRQ",
      "phone_code": "964"
    },
    {
      "nombre": "Irlanda",
      "name": "Ireland",
      "nom": "Irlande",
      "iso2": "IE",
      "iso3": "IRL",
      "phone_code": "353"
    },
    {
      "nombre": "Isla Bouvet",
      "name": "Bouvet Island",
      "nom": "Bouvet Island",
      "iso2": "BV",
      "iso3": "BVT",
      "phone_code": ""
    },
    {
      "nombre": "Isla de Man",
      "name": "Isle of Man",
      "nom": "Ile de Man",
      "iso2": "IM",
      "iso3": "IMN",
      "phone_code": "44"
    },
    {
      "nombre": "Isla de Navidad",
      "name": "Christmas Island",
      "nom": "Christmas Island",
      "iso2": "CX",
      "iso3": "CXR",
      "phone_code": "61"
    },
    {
      "nombre": "Isla Norfolk",
      "name": "Norfolk Island",
      "nom": "Île de Norfolk",
      "iso2": "NF",
      "iso3": "NFK",
      "phone_code": "672"
    },
    {
      "nombre": "Islandia",
      "name": "Iceland",
      "nom": "Islande",
      "iso2": "IS",
      "iso3": "ISL",
      "phone_code": "354"
    },
    {
      "nombre": "Islas Bermudas",
      "name": "Bermuda Islands",
      "nom": "Bermudes",
      "iso2": "BM",
      "iso3": "BMU",
      "phone_code": "1 441"
    },
    {
      "nombre": "Islas Caimán",
      "name": "Cayman Islands",
      "nom": "Iles Caïmans",
      "iso2": "KY",
      "iso3": "CYM",
      "phone_code": "1 345"
    },
    {
      "nombre": "Islas Cocos (Keeling)",
      "name": "Cocos (Keeling) Islands",
      "nom": "Cocos (Keeling",
      "iso2": "CC",
      "iso3": "CCK",
      "phone_code": "61"
    },
    {
      "nombre": "Islas Cook",
      "name": "Cook Islands",
      "nom": "Iles Cook",
      "iso2": "CK",
      "iso3": "COK",
      "phone_code": "682"
    },
    {
      "nombre": "Islas de Åland",
      "name": "Åland Islands",
      "nom": "Îles Åland",
      "iso2": "AX",
      "iso3": "ALA",
      "phone_code": "358"
    },
    {
      "nombre": "Islas Feroe",
      "name": "Faroe Islands",
      "nom": "Iles Féro",
      "iso2": "FO",
      "iso3": "FRO",
      "phone_code": "298"
    },
    {
      "nombre": "Islas Georgias del Sur y Sandwich del Sur",
      "name": "South Georgia and the South Sandwich Islands",
      "nom": "Géorgie du Sud et les Îles Sandwich du Sud",
      "iso2": "GS",
      "iso3": "SGS",
      "phone_code": "500"
    },
    {
      "nombre": "Islas Heard y McDonald",
      "name": "Heard Island and McDonald Islands",
      "nom": "Les îles Heard et McDonald",
      "iso2": "HM",
      "iso3": "HMD",
      "phone_code": ""
    },
    {
      "nombre": "Islas Maldivas",
      "name": "Maldives",
      "nom": "Maldives",
      "iso2": "MV",
      "iso3": "MDV",
      "phone_code": "960"
    },
    {
      "nombre": "Islas Malvinas",
      "name": "Falkland Islands (Malvinas)",
      "nom": "Iles Falkland (Malvinas",
      "iso2": "FK",
      "iso3": "FLK",
      "phone_code": "500"
    },
    {
      "nombre": "Islas Marianas del Norte",
      "name": "Northern Mariana Islands",
      "nom": "Iles Mariannes du Nord",
      "iso2": "MP",
      "iso3": "MNP",
      "phone_code": "1 670"
    },
    {
      "nombre": "Islas Marshall",
      "name": "Marshall Islands",
      "nom": "Iles Marshall",
      "iso2": "MH",
      "iso3": "MHL",
      "phone_code": "692"
    },
    {
      "nombre": "Islas Pitcairn",
      "name": "Pitcairn Islands",
      "nom": "Iles Pitcairn",
      "iso2": "PN",
      "iso3": "PCN",
      "phone_code": "870"
    },
    {
      "nombre": "Islas Salomón",
      "name": "Solomon Islands",
      "nom": "Iles Salomon",
      "iso2": "SB",
      "iso3": "SLB",
      "phone_code": "677"
    },
    {
      "nombre": "Islas Turcas y Caicos",
      "name": "Turks and Caicos Islands",
      "nom": "Iles Turques et Caïques",
      "iso2": "TC",
      "iso3": "TCA",
      "phone_code": "1 649"
    },
    {
      "nombre": "Islas Ultramarinas Menores de Estados Unidos",
      "name": "United States Minor Outlying Islands",
      "nom": "États-Unis Îles mineures éloignées",
      "iso2": "UM",
      "iso3": "UMI",
      "phone_code": "246"
    },
    {
      "nombre": "Islas Vírgenes Británicas",
      "name": "Virgin Islands",
      "nom": "Iles Vierges",
      "iso2": "VG",
      "iso3": "VGB",
      "phone_code": "1 284"
    },
    {
      "nombre": "Islas Vírgenes de los Estados Unidos",
      "name": "United States Virgin Islands",
      "nom": "Îles Vierges américaines",
      "iso2": "VI",
      "iso3": "VIR",
      "phone_code": "1 340"
    },
    {
      "nombre": "Israel",
      "name": "Israel",
      "nom": "Israël",
      "iso2": "IL",
      "iso3": "ISR",
      "phone_code": "972"
    },
    {
      "nombre": "Italia",
      "name": "Italy",
      "nom": "Italie",
      "iso2": "IT",
      "iso3": "ITA",
      "phone_code": "39"
    },
    {
      "nombre": "Jamaica",
      "name": "Jamaica",
      "nom": "Jamaïque",
      "iso2": "JM",
      "iso3": "JAM",
      "phone_code": "1 876"
    },
    {
      "nombre": "Japón",
      "name": "Japan",
      "nom": "Japon",
      "iso2": "JP",
      "iso3": "JPN",
      "phone_code": "81"
    },
    {
      "nombre": "Jersey",
      "name": "Jersey",
      "nom": "Maillot",
      "iso2": "JE",
      "iso3": "JEY",
      "phone_code": "44"
    },
    {
      "nombre": "Jordania",
      "name": "Jordan",
      "nom": "Jordan",
      "iso2": "JO",
      "iso3": "JOR",
      "phone_code": "962"
    },
    {
      "nombre": "Kazajistán",
      "name": "Kazakhstan",
      "nom": "Le Kazakhstan",
      "iso2": "KZ",
      "iso3": "KAZ",
      "phone_code": "7"
    },
    {
      "nombre": "Kenia",
      "name": "Kenya",
      "nom": "Kenya",
      "iso2": "KE",
      "iso3": "KEN",
      "phone_code": "254"
    },
    {
      "nombre": "Kirguistán",
      "name": "Kyrgyzstan",
      "nom": "Kirghizstan",
      "iso2": "KG",
      "iso3": "KGZ",
      "phone_code": "996"
    },
    {
      "nombre": "Kiribati",
      "name": "Kiribati",
      "nom": "Kiribati",
      "iso2": "KI",
      "iso3": "KIR",
      "phone_code": "686"
    },
    {
      "nombre": "Kuwait",
      "name": "Kuwait",
      "nom": "Koweït",
      "iso2": "KW",
      "iso3": "KWT",
      "phone_code": "965"
    },
    {
      "nombre": "Líbano",
      "name": "Lebanon",
      "nom": "Liban",
      "iso2": "LB",
      "iso3": "LBN",
      "phone_code": "961"
    },
    {
      "nombre": "Laos",
      "name": "Laos",
      "nom": "Laos",
      "iso2": "LA",
      "iso3": "LAO",
      "phone_code": "856"
    },
    {
      "nombre": "Lesoto",
      "name": "Lesotho",
      "nom": "Lesotho",
      "iso2": "LS",
      "iso3": "LSO",
      "phone_code": "266"
    },
    {
      "nombre": "Letonia",
      "name": "Latvia",
      "nom": "La Lettonie",
      "iso2": "LV",
      "iso3": "LVA",
      "phone_code": "371"
    },
    {
      "nombre": "Liberia",
      "name": "Liberia",
      "nom": "Liberia",
      "iso2": "LR",
      "iso3": "LBR",
      "phone_code": "231"
    },
    {
      "nombre": "Libia",
      "name": "Libya",
      "nom": "Libye",
      "iso2": "LY",
      "iso3": "LBY",
      "phone_code": "218"
    },
    {
      "nombre": "Liechtenstein",
      "name": "Liechtenstein",
      "nom": "Liechtenstein",
      "iso2": "LI",
      "iso3": "LIE",
      "phone_code": "423"
    },
    {
      "nombre": "Lituania",
      "name": "Lithuania",
      "nom": "La Lituanie",
      "iso2": "LT",
      "iso3": "LTU",
      "phone_code": "370"
    },
    {
      "nombre": "Luxemburgo",
      "name": "Luxembourg",
      "nom": "Luxembourg",
      "iso2": "LU",
      "iso3": "LUX",
      "phone_code": "352"
    },
    {
      "nombre": "México",
      "name": "Mexico",
      "nom": "Mexique",
      "iso2": "MX",
      "iso3": "MEX",
      "phone_code": "52"
    },
    {
      "nombre": "Mónaco",
      "name": "Monaco",
      "nom": "Monaco",
      "iso2": "MC",
      "iso3": "MCO",
      "phone_code": "377"
    },
    {
      "nombre": "Macao",
      "name": "Macao",
      "nom": "Macao",
      "iso2": "MO",
      "iso3": "MAC",
      "phone_code": "853"
    },
    {
      "nombre": "Macedônia",
      "name": "Macedonia",
      "nom": "Macédoine",
      "iso2": "MK",
      "iso3": "MKD",
      "phone_code": "389"
    },
    {
      "nombre": "Madagascar",
      "name": "Madagascar",
      "nom": "Madagascar",
      "iso2": "MG",
      "iso3": "MDG",
      "phone_code": "261"
    },
    {
      "nombre": "Malasia",
      "name": "Malaysia",
      "nom": "Malaisie",
      "iso2": "MY",
      "iso3": "MYS",
      "phone_code": "60"
    },
    {
      "nombre": "Malawi",
      "name": "Malawi",
      "nom": "Malawi",
      "iso2": "MW",
      "iso3": "MWI",
      "phone_code": "265"
    },
    {
      "nombre": "Mali",
      "name": "Mali",
      "nom": "Mali",
      "iso2": "ML",
      "iso3": "MLI",
      "phone_code": "223"
    },
    {
      "nombre": "Malta",
      "name": "Malta",
      "nom": "Malte",
      "iso2": "MT",
      "iso3": "MLT",
      "phone_code": "356"
    },
    {
      "nombre": "Marruecos",
      "name": "Morocco",
      "nom": "Maroc",
      "iso2": "MA",
      "iso3": "MAR",
      "phone_code": "212"
    },
    {
      "nombre": "Martinica",
      "name": "Martinique",
      "nom": "Martinique",
      "iso2": "MQ",
      "iso3": "MTQ",
      "phone_code": "596"
    },
    {
      "nombre": "Mauricio",
      "name": "Mauritius",
      "nom": "Iles Maurice",
      "iso2": "MU",
      "iso3": "MUS",
      "phone_code": "230"
    },
    {
      "nombre": "Mauritania",
      "name": "Mauritania",
      "nom": "Mauritanie",
      "iso2": "MR",
      "iso3": "MRT",
      "phone_code": "222"
    },
    {
      "nombre": "Mayotte",
      "name": "Mayotte",
      "nom": "Mayotte",
      "iso2": "YT",
      "iso3": "MYT",
      "phone_code": "262"
    },
    {
      "nombre": "Micronesia",
      "name": "Estados Federados de",
      "nom": "Federados Estados de",
      "iso2": "FM",
      "iso3": "FSM",
      "phone_code": "691"
    },
    {
      "nombre": "Moldavia",
      "name": "Moldova",
      "nom": "Moldavie",
      "iso2": "MD",
      "iso3": "MDA",
      "phone_code": "373"
    },
    {
      "nombre": "Mongolia",
      "name": "Mongolia",
      "nom": "Mongolie",
      "iso2": "MN",
      "iso3": "MNG",
      "phone_code": "976"
    },
    {
      "nombre": "Montenegro",
      "name": "Montenegro",
      "nom": "Monténégro",
      "iso2": "ME",
      "iso3": "MNE",
      "phone_code": "382"
    },
    {
      "nombre": "Montserrat",
      "name": "Montserrat",
      "nom": "Montserrat",
      "iso2": "MS",
      "iso3": "MSR",
      "phone_code": "1 664"
    },
    {
      "nombre": "Mozambique",
      "name": "Mozambique",
      "nom": "Mozambique",
      "iso2": "MZ",
      "iso3": "MOZ",
      "phone_code": "258"
    },
    {
      "nombre": "Namibia",
      "name": "Namibia",
      "nom": "Namibie",
      "iso2": "NA",
      "iso3": "NAM",
      "phone_code": "264"
    },
    {
      "nombre": "Nauru",
      "name": "Nauru",
      "nom": "Nauru",
      "iso2": "NR",
      "iso3": "NRU",
      "phone_code": "674"
    },
    {
      "nombre": "Nepal",
      "name": "Nepal",
      "nom": "Népal",
      "iso2": "NP",
      "iso3": "NPL",
      "phone_code": "977"
    },
    {
      "nombre": "Nicaragua",
      "name": "Nicaragua",
      "nom": "Nicaragua",
      "iso2": "NI",
      "iso3": "NIC",
      "phone_code": "505"
    },
    {
      "nombre": "Niger",
      "name": "Niger",
      "nom": "Niger",
      "iso2": "NE",
      "iso3": "NER",
      "phone_code": "227"
    },
    {
      "nombre": "Nigeria",
      "name": "Nigeria",
      "nom": "Nigeria",
      "iso2": "NG",
      "iso3": "NGA",
      "phone_code": "234"
    },
    {
      "nombre": "Niue",
      "name": "Niue",
      "nom": "Niou",
      "iso2": "NU",
      "iso3": "NIU",
      "phone_code": "683"
    },
    {
      "nombre": "Noruega",
      "name": "Norway",
      "nom": "Norvège",
      "iso2": "NO",
      "iso3": "NOR",
      "phone_code": "47"
    },
    {
      "nombre": "Nueva Caledonia",
      "name": "New Caledonia",
      "nom": "Nouvelle-Calédonie",
      "iso2": "NC",
      "iso3": "NCL",
      "phone_code": "687"
    },
    {
      "nombre": "Nueva Zelanda",
      "name": "New Zealand",
      "nom": "Nouvelle-Zélande",
      "iso2": "NZ",
      "iso3": "NZL",
      "phone_code": "64"
    },
    {
      "nombre": "Omán",
      "name": "Oman",
      "nom": "Oman",
      "iso2": "OM",
      "iso3": "OMN",
      "phone_code": "968"
    },
    {
      "nombre": "Países Bajos",
      "name": "Netherlands",
      "nom": "Pays-Bas",
      "iso2": "NL",
      "iso3": "NLD",
      "phone_code": "31"
    },
    {
      "nombre": "Pakistán",
      "name": "Pakistan",
      "nom": "Pakistan",
      "iso2": "PK",
      "iso3": "PAK",
      "phone_code": "92"
    },
    {
      "nombre": "Palau",
      "name": "Palau",
      "nom": "Palau",
      "iso2": "PW",
      "iso3": "PLW",
      "phone_code": "680"
    },
    {
      "nombre": "Palestina",
      "name": "Palestine",
      "nom": "La Palestine",
      "iso2": "PS",
      "iso3": "PSE",
      "phone_code": "970"
    },
    {
      "nombre": "Panamá",
      "name": "Panama",
      "nom": "Panama",
      "iso2": "PA",
      "iso3": "PAN",
      "phone_code": "507"
    },
    {
      "nombre": "Papúa Nueva Guinea",
      "name": "Papua New Guinea",
      "nom": "Papouasie-Nouvelle-Guinée",
      "iso2": "PG",
      "iso3": "PNG",
      "phone_code": "675"
    },
    {
      "nombre": "Paraguay",
      "name": "Paraguay",
      "nom": "Paraguay",
      "iso2": "PY",
      "iso3": "PRY",
      "phone_code": "595"
    },
    {
      "nombre": "Perú",
      "name": "Peru",
      "nom": "Pérou",
      "iso2": "PE",
      "iso3": "PER",
      "phone_code": "51"
    },
    {
      "nombre": "Polinesia Francesa",
      "name": "French Polynesia",
      "nom": "Polynésie française",
      "iso2": "PF",
      "iso3": "PYF",
      "phone_code": "689"
    },
    {
      "nombre": "Polonia",
      "name": "Poland",
      "nom": "Pologne",
      "iso2": "PL",
      "iso3": "POL",
      "phone_code": "48"
    },
    {
      "nombre": "Portugal",
      "name": "Portugal",
      "nom": "Portugal",
      "iso2": "PT",
      "iso3": "PRT",
      "phone_code": "351"
    },
    {
      "nombre": "Puerto Rico",
      "name": "Puerto Rico",
      "nom": "Porto Rico",
      "iso2": "PR",
      "iso3": "PRI",
      "phone_code": "1"
    },
    {
      "nombre": "Qatar",
      "name": "Qatar",
      "nom": "Qatar",
      "iso2": "QA",
      "iso3": "QAT",
      "phone_code": "974"
    },
    {
      "nombre": "Reino Unido",
      "name": "United Kingdom",
      "nom": "Royaume-Uni",
      "iso2": "GB",
      "iso3": "GBR",
      "phone_code": "44"
    },
    {
      "nombre": "República Centroafricana",
      "name": "Central African Republic",
      "nom": "République Centrafricaine",
      "iso2": "CF",
      "iso3": "CAF",
      "phone_code": "236"
    },
    {
      "nombre": "República Checa",
      "name": "Czech Republic",
      "nom": "République Tchèque",
      "iso2": "CZ",
      "iso3": "CZE",
      "phone_code": "420"
    },
    {
      "nombre": "República Dominicana",
      "name": "Dominican Republic",
      "nom": "République Dominicaine",
      "iso2": "DO",
      "iso3": "DOM",
      "phone_code": "1 809"
    },
    {
      "nombre": "República de Sudán del Sur",
      "name": "South Sudan",
      "nom": "Soudan du Sud",
      "iso2": "SS",
      "iso3": "SSD",
      "phone_code": "211"
    },
    {
      "nombre": "Reunión",
      "name": "Réunion",
      "nom": "Réunion",
      "iso2": "RE",
      "iso3": "REU",
      "phone_code": "262"
    },
    {
      "nombre": "Ruanda",
      "name": "Rwanda",
      "nom": "Rwanda",
      "iso2": "RW",
      "iso3": "RWA",
      "phone_code": "250"
    },
    {
      "nombre": "Rumanía",
      "name": "Romania",
      "nom": "Roumanie",
      "iso2": "RO",
      "iso3": "ROU",
      "phone_code": "40"
    },
    {
      "nombre": "Rusia",
      "name": "Russia",
      "nom": "La Russie",
      "iso2": "RU",
      "iso3": "RUS",
      "phone_code": "7"
    },
    {
      "nombre": "Sahara Occidental",
      "name": "Western Sahara",
      "nom": "Sahara Occidental",
      "iso2": "EH",
      "iso3": "ESH",
      "phone_code": "212"
    },
    {
      "nombre": "Samoa",
      "name": "Samoa",
      "nom": "Samoa",
      "iso2": "WS",
      "iso3": "WSM",
      "phone_code": "685"
    },
    {
      "nombre": "Samoa Americana",
      "name": "American Samoa",
      "nom": "Les Samoa américaines",
      "iso2": "AS",
      "iso3": "ASM",
      "phone_code": "1 684"
    },
    {
      "nombre": "San Bartolomé",
      "name": "Saint Barthélemy",
      "nom": "Saint-Barthélemy",
      "iso2": "BL",
      "iso3": "BLM",
      "phone_code": "590"
    },
    {
      "nombre": "San Cristóbal y Nieves",
      "name": "Saint Kitts and Nevis",
      "nom": "Saint Kitts et Nevis",
      "iso2": "KN",
      "iso3": "KNA",
      "phone_code": "1 869"
    },
    {
      "nombre": "San Marino",
      "name": "San Marino",
      "nom": "San Marino",
      "iso2": "SM",
      "iso3": "SMR",
      "phone_code": "378"
    },
    {
      "nombre": "San Martín (Francia)",
      "name": "Saint Martin (French part)",
      "nom": "Saint-Martin (partie française)",
      "iso2": "MF",
      "iso3": "MAF",
      "phone_code": "1 599"
    },
    {
      "nombre": "San Pedro y Miquelón",
      "name": "Saint Pierre and Miquelon",
      "nom": "Saint-Pierre-et-Miquelon",
      "iso2": "PM",
      "iso3": "SPM",
      "phone_code": "508"
    },
    {
      "nombre": "San Vicente y las Granadinas",
      "name": "Saint Vincent and the Grenadines",
      "nom": "Saint-Vincent et Grenadines",
      "iso2": "VC",
      "iso3": "VCT",
      "phone_code": "1 784"
    },
    {
      "nombre": "Santa Elena",
      "name": "Ascensión y Tristán de Acuña",
      "nom": "Ascensión y Tristan de Acuña",
      "iso2": "SH",
      "iso3": "SHN",
      "phone_code": "290"
    },
    {
      "nombre": "Santa Lucía",
      "name": "Saint Lucia",
      "nom": "Sainte-Lucie",
      "iso2": "LC",
      "iso3": "LCA",
      "phone_code": "1 758"
    },
    {
      "nombre": "Santo Tomé y Príncipe",
      "name": "Sao Tome and Principe",
      "nom": "Sao Tomé et Principe",
      "iso2": "ST",
      "iso3": "STP",
      "phone_code": "239"
    },
    {
      "nombre": "Senegal",
      "name": "Senegal",
      "nom": "Sénégal",
      "iso2": "SN",
      "iso3": "SEN",
      "phone_code": "221"
    },
    {
      "nombre": "Serbia",
      "name": "Serbia",
      "nom": "Serbie",
      "iso2": "RS",
      "iso3": "SRB",
      "phone_code": "381"
    },
    {
      "nombre": "Seychelles",
      "name": "Seychelles",
      "nom": "Les Seychelles",
      "iso2": "SC",
      "iso3": "SYC",
      "phone_code": "248"
    },
    {
      "nombre": "Sierra Leona",
      "name": "Sierra Leone",
      "nom": "Sierra Leone",
      "iso2": "SL",
      "iso3": "SLE",
      "phone_code": "232"
    },
    {
      "nombre": "Singapur",
      "name": "Singapore",
      "nom": "Singapour",
      "iso2": "SG",
      "iso3": "SGP",
      "phone_code": "65"
    },
    {
      "nombre": "Sint Maarten",
      "name": "Sint Maarten",
      "nom": "Saint-Martin",
      "iso2": "SX",
      "iso3": "SMX",
      "phone_code": "1 721"
    },
    {
      "nombre": "Siria",
      "name": "Syria",
      "nom": "Syrie",
      "iso2": "SY",
      "iso3": "SYR",
      "phone_code": "963"
    },
    {
      "nombre": "Somalia",
      "name": "Somalia",
      "nom": "Somalie",
      "iso2": "SO",
      "iso3": "SOM",
      "phone_code": "252"
    },
    {
      "nombre": "Sri lanka",
      "name": "Sri Lanka",
      "nom": "Sri Lanka",
      "iso2": "LK",
      "iso3": "LKA",
      "phone_code": "94"
    },
    {
      "nombre": "Sudáfrica",
      "name": "South Africa",
      "nom": "Afrique du Sud",
      "iso2": "ZA",
      "iso3": "ZAF",
      "phone_code": "27"
    },
    {
      "nombre": "Sudán",
      "name": "Sudan",
      "nom": "Soudan",
      "iso2": "SD",
      "iso3": "SDN",
      "phone_code": "249"
    },
    {
      "nombre": "Suecia",
      "name": "Sweden",
      "nom": "Suède",
      "iso2": "SE",
      "iso3": "SWE",
      "phone_code": "46"
    },
    {
      "nombre": "Suiza",
      "name": "Switzerland",
      "nom": "Suisse",
      "iso2": "CH",
      "iso3": "CHE",
      "phone_code": "41"
    },
    {
      "nombre": "Surinám",
      "name": "Suriname",
      "nom": "Surinam",
      "iso2": "SR",
      "iso3": "SUR",
      "phone_code": "597"
    },
    {
      "nombre": "Svalbard y Jan Mayen",
      "name": "Svalbard and Jan Mayen",
      "nom": "Svalbard et Jan Mayen",
      "iso2": "SJ",
      "iso3": "SJM",
      "phone_code": "47"
    },
    {
      "nombre": "Swazilandia",
      "name": "Swaziland",
      "nom": "Swaziland",
      "iso2": "SZ",
      "iso3": "SWZ",
      "phone_code": "268"
    },
    {
      "nombre": "Tayikistán",
      "name": "Tajikistan",
      "nom": "Le Tadjikistan",
      "iso2": "TJ",
      "iso3": "TJK",
      "phone_code": "992"
    },
    {
      "nombre": "Tailandia",
      "name": "Thailand",
      "nom": "Thaïlande",
      "iso2": "TH",
      "iso3": "THA",
      "phone_code": "66"
    },
    {
      "nombre": "Taiwán",
      "name": "Taiwan",
      "nom": "Taiwan",
      "iso2": "TW",
      "iso3": "TWN",
      "phone_code": "886"
    },
    {
      "nombre": "Tanzania",
      "name": "Tanzania",
      "nom": "Tanzanie",
      "iso2": "TZ",
      "iso3": "TZA",
      "phone_code": "255"
    },
    {
      "nombre": "Territorio Británico del Océano Índico",
      "name": "British Indian Ocean Territory",
      "nom": "Territoire britannique de l'océan Indien",
      "iso2": "IO",
      "iso3": "IOT",
      "phone_code": "246"
    },
    {
      "nombre": "Territorios Australes y Antárticas Franceses",
      "name": "French Southern Territories",
      "nom": "Terres australes françaises",
      "iso2": "TF",
      "iso3": "ATF",
      "phone_code": ""
    },
    {
      "nombre": "Timor Oriental",
      "name": "East Timor",
      "nom": "Timor-Oriental",
      "iso2": "TL",
      "iso3": "TLS",
      "phone_code": "670"
    },
    {
      "nombre": "Togo",
      "name": "Togo",
      "nom": "Togo",
      "iso2": "TG",
      "iso3": "TGO",
      "phone_code": "228"
    },
    {
      "nombre": "Tokelau",
      "name": "Tokelau",
      "nom": "Tokélaou",
      "iso2": "TK",
      "iso3": "TKL",
      "phone_code": "690"
    },
    {
      "nombre": "Tonga",
      "name": "Tonga",
      "nom": "Tonga",
      "iso2": "TO",
      "iso3": "TON",
      "phone_code": "676"
    },
    {
      "nombre": "Trinidad y Tobago",
      "name": "Trinidad and Tobago",
      "nom": "Trinidad et Tobago",
      "iso2": "TT",
      "iso3": "TTO",
      "phone_code": "1 868"
    },
    {
      "nombre": "Tunez",
      "name": "Tunisia",
      "nom": "Tunisie",
      "iso2": "TN",
      "iso3": "TUN",
      "phone_code": "216"
    },
    {
      "nombre": "Turkmenistán",
      "name": "Turkmenistan",
      "nom": "Le Turkménistan",
      "iso2": "TM",
      "iso3": "TKM",
      "phone_code": "993"
    },
    {
      "nombre": "Turquía",
      "name": "Turkey",
      "nom": "Turquie",
      "iso2": "TR",
      "iso3": "TUR",
      "phone_code": "90"
    },
    {
      "nombre": "Tuvalu",
      "name": "Tuvalu",
      "nom": "Tuvalu",
      "iso2": "TV",
      "iso3": "TUV",
      "phone_code": "688"
    },
    {
      "nombre": "Ucrania",
      "name": "Ukraine",
      "nom": "L'Ukraine",
      "iso2": "UA",
      "iso3": "UKR",
      "phone_code": "380"
    },
    {
      "nombre": "Uganda",
      "name": "Uganda",
      "nom": "Ouganda",
      "iso2": "UG",
      "iso3": "UGA",
      "phone_code": "256"
    },
    {
      "nombre": "Uruguay",
      "name": "Uruguay",
      "nom": "Uruguay",
      "iso2": "UY",
      "iso3": "URY",
      "phone_code": "598"
    },
    {
      "nombre": "Uzbekistán",
      "name": "Uzbekistan",
      "nom": "L'Ouzbékistan",
      "iso2": "UZ",
      "iso3": "UZB",
      "phone_code": "998"
    },
    {
      "nombre": "Vanuatu",
      "name": "Vanuatu",
      "nom": "Vanuatu",
      "iso2": "VU",
      "iso3": "VUT",
      "phone_code": "678"
    },
    {
      "nombre": "Venezuela",
      "name": "Venezuela",
      "nom": "Venezuela",
      "iso2": "VE",
      "iso3": "VEN",
      "phone_code": "58"
    },
    {
      "nombre": "Vietnam",
      "name": "Vietnam",
      "nom": "Vietnam",
      "iso2": "VN",
      "iso3": "VNM",
      "phone_code": "84"
    },
    {
      "nombre": "Wallis y Futuna",
      "name": "Wallis and Futuna",
      "nom": "Wallis et Futuna",
      "iso2": "WF",
      "iso3": "WLF",
      "phone_code": "681"
    },
    {
      "nombre": "Yemen",
      "name": "Yemen",
      "nom": "Yémen",
      "iso2": "YE",
      "iso3": "YEM",
      "phone_code": "967"
    },
    {
      "nombre": "Yibuti",
      "name": "Djibouti",
      "nom": "Djibouti",
      "iso2": "DJ",
      "iso3": "DJI",
      "phone_code": "253"
    },
    {
      "nombre": "Zambia",
      "name": "Zambia",
      "nom": "Zambie",
      "iso2": "ZM",
      "iso3": "ZMB",
      "phone_code": "260"
    },
    {
      "nombre": "Zimbabue",
      "name": "Zimbabwe",
      "nom": "Zimbabwe",
      "iso2": "ZW",
      "iso3": "ZWE",
      "phone_code": "263"
    }
  ];



  comunas_regiones =
    [{
      "region": "Arica y Parinacota",
      "comunas": ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
      "region": "Tarapacá",
      "comunas": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    {
      "region": "Antofagasta",
      "comunas": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
    },
    {
      "region": "Atacama",
      "comunas": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
    },
    {
      "region": "Coquimbo",
      "comunas": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
    },
    {
      "region": "Valparaíso",
      "comunas": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
    },
    {
      "region": "Libertador Gral. Bernardo O’Higgins",
      "comunas": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
    },
    {
      "region": "Maule",
      "comunas": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
    },
    {
      "region": "Ñuble",
      "comunas": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
    },
    {
      "region": "Biobío",
      "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
    },
    {
      "region": "Araucanía",
      "comunas": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
    },
    {
      "region": "Los Ríos",
      "comunas": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
    },
    {
      "region": "Los Lagos",
      "comunas": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
    },
    {
      "region": "Aisén del Gral. Carlos Ibáñez del Campo",
      "comunas": ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
    },
    {
      "region": "Magallanes y de la Antártica Chilena",
      "comunas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
    },
    {
      "region": "Metropolitana de Santiago",
      "comunas": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
    }];
}
