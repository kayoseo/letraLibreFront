import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormInscriptionComponent } from './components/form-inscription/form-inscription.component';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatRadioButton, MatRadioGroup, MatRadioModule, MatSelectModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';
import localeEs from '@angular/common/locales/es';
import { HashLocationStrategy, LocationStrategy,registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CalendlyComponent } from './components/calendly/calendly.component';
registerLocaleData(localeEs,'es');
@NgModule({
  declarations: [
    AppComponent,
    FormInscriptionComponent,
    CalendlyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    HttpClientModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },{ provide: LOCALE_ID, useValue: "es" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
