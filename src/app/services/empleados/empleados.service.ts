import { Injectable } from '@angular/core';
import { Empleado } from 'src/app/models/empleado.model';
import { DepartamentosComponent } from 'src/app/departamentos/departamentos.component';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private emp: string = "Empleados";

  constructor() { }

  getEmpleados(): Array<Empleado> {
    return <Empleado[]>JSON.parse(localStorage.getItem(this.emp));
  }

  setEmpleado(empleado: Empleado): boolean {
    try {
      let empleados: Array<Empleado> = new Array<Empleado>();
      let res = this.getEmpleados();
      empleados = res !== null ? res : empleados;
      empleados.push(empleado);
      localStorage.setItem(this.emp, JSON.stringify(empleados));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  updateEmpleado(empleado: Empleado): boolean {
    let emp: Array<Empleado> = this.getEmpleados();
    try {
      let index: number = emp.map(function (e) { return e.codigo }).indexOf(empleado.codigo);
      if (index !== -1) {
        emp[index] = empleado;
        localStorage.setItem(this.emp, JSON.stringify(emp));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteEmpleado(codigo: number): boolean {
    let emp: Array<Empleado> = this.getEmpleados();
    try {
      let index: number = emp.map(function (e) { return e.codigo; }).indexOf(codigo);
      if (index !== -1) {
        emp.splice(index, 1);
        localStorage.setItem(this.emp, JSON.stringify(emp));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
