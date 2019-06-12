import { Injectable } from '@angular/core';
import { Ingreso } from 'src/app/models/ingreso.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private i: string = "Ingresos";

  constructor() { }

  getIngreso(idnomina: number): Array<Ingreso> {
    let res = <Ingreso[]>JSON.parse(localStorage.getItem(this.i));
    return res.filter(item => item.idnomina === idnomina);
  }

  setIngreso(ingresos: Ingreso[]): number {
    try {
      let linea = this.getNuevaLinea();
      let idnomina = ingresos[0].idnomina;
      let ingresosAct = <Ingreso[]>JSON.parse(localStorage.getItem(this.i));
      if (ingresosAct !== null) { 
        let ingresosDep = ingresosAct.filter(item => item.idnomina === idnomina);
        let index = ingresosAct.map(function (e) { return e.idnomina; }).indexOf(idnomina);
        ingresosAct.splice(index, ingresosDep.length);
        ingresos.forEach(element => {
          element.contidad = +element.contidad;
          element.lienanumero = linea;
          ingresosAct.push(element);
        });
      }else{
        ingresosAct = ingresos
      }
      localStorage.setItem(this.i, JSON.stringify(ingresosAct));
      return linea;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  deleteIngreso(idnomina: number): boolean {
    try {
      let ingresosAct = <Ingreso[]>JSON.parse(localStorage.getItem(this.i));
      let ingresosDep = ingresosAct.filter(item => item.idnomina === idnomina);
      let index = ingresosAct.map(function (e) { return e.idnomina; }).indexOf(idnomina);
      ingresosAct.splice(index, ingresosDep.length);
      localStorage.setItem(this.i, JSON.stringify(ingresosAct));
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getNuevaLinea(): number {
    let registros = <Ingreso[]>JSON.parse(localStorage.getItem(this.i));
    try {
      let nuevo = Math.max.apply(Math, registros.map(function (e) { return e.lienanumero; })) + 1;
      return nuevo;
    } catch (error) {
      return 1;
    }
  }

  getTotalXNomina(idnomina: number):number{
    let res = <Ingreso[]>JSON.parse(localStorage.getItem(this.i));
    let resNomina =  res.filter(item => item.idnomina === idnomina);
    let total:number = 0;
    resNomina.forEach(element => {
      total += element.contidad;
    });
    return total;
  }
}
