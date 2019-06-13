import { Injectable } from '@angular/core';
import { Departamento } from 'src/app/models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  private depto: string = "Departamentos";

  constructor() { }

  getDepartamentos(): Array<Departamento> {
    try {
      return <Departamento[]>JSON.parse(localStorage.getItem(this.depto));
    } catch (error) {
      console.log(error);
      return Array<Departamento>();
    }
  }

  setDepartamento(departamento: Departamento): boolean {
    try {
      let deptos: Array<Departamento> = new Array<Departamento>()
      let res = this.getDepartamentos()
      deptos = res !== null ? res : deptos;
      deptos.push(departamento);
      localStorage.setItem(this.depto, JSON.stringify(deptos));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  updateDepartamento(departamento: Departamento): boolean {
    let deptos: Array<Departamento> = this.getDepartamentos();
    try {
      let index: number = deptos.map(function (e) { return e.codigo; }).indexOf(departamento.codigo);
      if (index !== -1) {
        deptos[index] = departamento;
        localStorage.setItem(this.depto, JSON.stringify(deptos));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteDepartamento(codigo: number): boolean {
    let deptos: Array<Departamento> = this.getDepartamentos();
    try {
      let index: number = deptos.map(function (e) { return e.codigo; }).indexOf(codigo);
      if (index !== -1) {
        deptos.splice(index, 1);
        localStorage.setItem(this.depto, JSON.stringify(deptos));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
