import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendlyComponent } from './components/calendly/calendly.component';
import { FormInscriptionComponent } from './components/form-inscription/form-inscription.component';

const routes: Routes = [
  { path: '', component: FormInscriptionComponent },
  { path: 'agendamiento', component: CalendlyComponent },
  { path: 'agendamiento/:name/:email/:rut/:phone', component: CalendlyComponent },
  { path: '**', component: FormInscriptionComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule { }
