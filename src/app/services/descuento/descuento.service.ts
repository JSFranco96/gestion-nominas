import { Injectable } from '@angular/core';
import { Descuento } from 'src/app/models/descuento.model';

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {

  private d:string = "Descuento";

  constructor() { }

  getDescuentos(idnomina: number): Array<Descuento> {
    try {
      let res = <Descuento[]>JSON.parse(localStorage.getItem(this.d));
      return res.filter(item => item.idnomina === idnomina);
    } catch (error) {
      console.log(error);
      return new Array<Descuento>();
    }
  }

  setDescuentos(descuento: Descuento[]): boolean {
    try {
      let idnomina = descuento[0].idnomina;
      let descuentosAct = <Descuento[]>JSON.parse(localStorage.getItem(this.d));
      if (descuentosAct !== null) { 
        let descuentosDep = descuentosAct.filter(item => item.idnomina === idnomina);
        let index = descuentosAct.map(function (e) { return e.idnomina; }).indexOf(idnomina);
        descuentosAct.splice(index, descuentosDep.length);
        descuento.forEach(element => {
          element.cantidad = +element.cantidad;
          descuentosAct.push(element);
        });
      }else{
        descuentosAct = descuento
      }
      localStorage.setItem(this.d, JSON.stringify(descuentosAct));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteDescuentos(idnomina: number): boolean {
    try {
      let descuentosAct = <Descuento[]>JSON.parse(localStorage.getItem(this.d));
      let descuentosDep = descuentosAct.filter(item => item.idnomina === idnomina);
      let index = descuentosAct.map(function (e) { return e.idnomina; }).indexOf(idnomina);
      descuentosAct.splice(index, descuentosDep.length);
      localStorage.setItem(this.d, JSON.stringify(descuentosAct));
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getTotalXNomina(idnomina: number):number{
    try {
      let res = <Descuento[]>JSON.parse(localStorage.getItem(this.d));
      let resNomina =  res.filter(item => item.idnomina === idnomina);
      let total:number = 0;
      resNomina.forEach(element => {
        total += element.cantidad;
      });
      return total;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
