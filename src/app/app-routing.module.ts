import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { NominaComponent } from './nomina/nomina.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConceptoRetributivoComponent } from './concepto-retributivo/concepto-retributivo.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'inicio', pathMatch: 'full'
  },
  {
    path: 'inicio', component: InicioComponent
  },
  {
    path: 'empleados', component: EmpleadosComponent
  },
  {
    path: 'nomina', component: NominaComponent
  },
  {
    path: 'departamentos', component: DepartamentosComponent
  },
  {
    path: 'conceptos', component: ConceptoRetributivoComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
