import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendlyBusinessComponent } from './components/calendly-business/calendly-business.component';
import { CalendlyComponent } from './components/calendly/calendly.component';
import { FormInscriptionBusinessComponent } from './components/form-inscription-business/form-inscription-business.component';
import { FormInscriptionComponent } from './components/form-inscription/form-inscription.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ReincriptionComponent } from './components/reincription/reincription.component';

const routes: Routes = [
  { path: 'inscripcion', component: FormInscriptionComponent },
  { path: 'inscripcion-especial', component: FormInscriptionBusinessComponent },
  { path: 'agendamiento', component: CalendlyComponent },
  { path: 'agendamiento/:name/:email/:rut/:phone', component: CalendlyComponent },
  { path: 'agendamiento-empresas', component: CalendlyBusinessComponent },
  { path: 'agendamiento-empresas/:name/:email/:rut/:phone', component: CalendlyBusinessComponent },
  { path: 'confirmacion/:email/:firstname/:idSalesforce', component: ReincriptionComponent },
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule { }
