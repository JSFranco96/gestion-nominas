import { Injectable } from '@angular/core';
import { Trabaja } from 'src/app/models/trabaja.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  private f: string = "Funciones";

  constructor() { }

  getFunciones(codigoempleado: number): Array<Trabaja> {
    try {
      let res = <Trabaja[]>JSON.parse(localStorage.getItem(this.f));
      return res.filter(item => item.codigoempleado === codigoempleado);
    } catch (error) {
      console.log(error);
      return new Array<Trabaja>();      
    }
  }

  setFunciones(funciones: Trabaja[]): boolean {
    try {
      let codigoempleado = funciones[0].codigoempleado;
      let funcionesAct = <Trabaja[]>JSON.parse(localStorage.getItem(this.f));
      if (funcionesAct !== null) { 
        let functionesDep = funcionesAct.filter(item => item.codigoempleado === codigoempleado);
        let index = funcionesAct.map(function (e) { return e.codigoempleado; }).indexOf(codigoempleado);
        funcionesAct.splice(index, functionesDep.length);
        funciones.forEach(element => {
          funcionesAct.push(element);
        });
      }else{
        funcionesAct = funciones
      }
      localStorage.setItem(this.f, JSON.stringify(funcionesAct));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteFunciones(codigoempleado: number): boolean {
    try {
      let funcionesAct = <Trabaja[]>JSON.parse(localStorage.getItem(this.f));
      let funcionesDep = funcionesAct.filter(item => item.codigoempleado === codigoempleado);
      let index = funcionesAct.map(function (e) { return e.codigoempleado; }).indexOf(codigoempleado);
      funcionesAct.splice(index, funcionesDep.length);
      localStorage.setItem(this.f, JSON.stringify(funcionesAct));
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
