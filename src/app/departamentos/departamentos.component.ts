import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartamentosService } from '../services/departamentos/departamentos.service';
import { Departamento } from '../models/departamento.model';
import { Sede } from '../models/sede.model';
import { SedesService } from '../services/sedes/sedes.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {

  listaDeDepartamentos: Array<Departamento> = [];
  listaDeSedes: Array<Sede> = [];
  actualizando: boolean = false;

  departamento: Departamento = { codigo: null, nombre: null };
  sede: Sede = { codigo: null, nombre: null, codigodepartamento: null };

  constructor(
    private departamentosservice: DepartamentosService, 
    private sedesservice: SedesService) { }


  ngOnInit() {
    this.listaDeDepartamentos = this.departamentosservice.getDepartamentos();
  }

  frmDepartamento = new FormGroup({
    codigo: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required)
  });

  frmSedes = new FormGroup({
    codigosede: new FormControl('', Validators.required),
    nombresede: new FormControl('', Validators.required)
  });

  get codigo(){
    return this.frmDepartamento.get("codigo");
  }

  agregarSede() {
    if (this.departamento.codigo) {
      if (this.frmSedes.valid) {
        this.sede.codigodepartamento = this.departamento.codigo;
        this.listaDeSedes.push(this.sede);
        this.sede = { codigo: null, nombre: null, codigodepartamento: null };
        return;
      }
      else alert("Debe llenar los campos de la sede");
    }
    else alert("No puede asignar sedes antes de ingresar los datos del departamento");
  }

  removerSede(codigo: number) {
    let index: number = this.listaDeSedes.map(function (e) { return e.codigo; }).indexOf(codigo);
    if (index !== -1) {
      this.listaDeSedes.splice(index, 1);
    }
  }

  guardarDepartamento() {
    if (this.frmDepartamento.valid) {
      let resDepto: boolean = false;
      if (!this.actualizando) {
        resDepto = this.departamentosservice.setDepartamento(this.departamento)
      } else {
        resDepto = this.departamentosservice.updateDepartamento(this.departamento)
      }
      if (resDepto) {
        let resSedes: boolean = this.sedesservice.setSede(this.listaDeSedes)
        if (resSedes) {
          this.listaDeDepartamentos = this.departamentosservice.getDepartamentos();
          alert("Departamento " + (this.actualizando ? "actualizado" : "creado") + " exitosamente!");
          this.limpiar();
        }
        else alert("Ocurrió un error creando las sedes.");
      }
      else alert("Ocurrió un error " + (this.actualizando ? "actualizando" : "creando") + " el departamento.");
    }
    else alert("Debe llenar los campos");
  }

  cargarDepto(depto: Departamento) {
    this.actualizando = true;
    this.codigo.disable();
    this.departamento = depto;
    this.listaDeSedes = this.cargarSedes(depto.codigo);
  }

  cargarSedes(codigo: number): Array<Sede> {
    return this.sedesservice.getSedes(codigo);
  }

  limpiar() {
    this.listaDeSedes = [];
    this.sede = { codigo: null, nombre: null, codigodepartamento: null };
    this.departamento = { codigo: null, nombre: null };
    this.actualizando = false;
    this.codigo.enable();
  }

  eliminarDepto(codigo: number) {
    if (this.departamentosservice.deleteDepartamento(codigo)) {
      if(this.sedesservice.deleteSedes(codigo)){
        let index: number = this.listaDeDepartamentos.map(function (e) { return e.codigo; }).indexOf(codigo);
        if (index !== -1) this.listaDeDepartamentos.splice(index, 1);
        alert("Departamento eliminado exitosamente");
        this.limpiar();
      }
    }
    else alert("Ocurrió un error eliminando el departamento.");
  }
}
