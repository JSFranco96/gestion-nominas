import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { NominaComponent } from './nomina/nomina.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { InicioComponent } from './inicio/inicio.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConceptoRetributivoComponent } from './concepto-retributivo/concepto-retributivo.component';

@NgModule({
  declarations: [
    AppComponent,
    EmpleadosComponent,
    NominaComponent,
    DepartamentosComponent,
    InicioComponent,
    NotFoundComponent,
    ConceptoRetributivoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
