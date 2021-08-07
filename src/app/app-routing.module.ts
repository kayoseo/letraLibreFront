import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendlyComponent } from './components/calendly/calendly.component';
import { FormInscriptionBusinessComponent } from './components/form-inscription-business/form-inscription-business.component';
import { FormInscriptionComponent } from './components/form-inscription/form-inscription.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: 'inscripcion', component: FormInscriptionComponent },
  { path: 'inscripcion-especial', component: FormInscriptionBusinessComponent },
  { path: 'agendamiento', component: CalendlyComponent },
  { path: 'agendamiento/:name/:email/:rut/:phone', component: CalendlyComponent },
  { path: '**', component: NotFoundComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule { }
