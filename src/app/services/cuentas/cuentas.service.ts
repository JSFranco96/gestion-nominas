import { Injectable } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {

  private c = "Cuenta";

  constructor() { }

  getCuentas(): Array<Cuenta> {
    return <Cuenta[]>JSON.parse(localStorage.getItem(this.c));
  }

  getCuentaXId(idcuenta: number): Cuenta{
    let res = <Cuenta[]>JSON.parse(localStorage.getItem(this.c));
    return res.filter(item => item.idcuenta === idcuenta)[0];
  }

  setCuenta(cuenta: Cuenta): number {
    try {
      cuenta.idcuenta = this.getNuevoId();
      let registro = this.getCuentas();
      if (registro !== null) {
        registro.push(cuenta);
      }else{
        registro = [cuenta];
      }
      localStorage.setItem(this.c, JSON.stringify(registro));
      return cuenta.idcuenta;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  updateCuenta(cuenta: Cuenta): number {
    try {
      let registros = this.getCuentas();
      let index: number = registros.map(function (e) { return e.idcuenta }).indexOf(cuenta.idcuenta);
      registros[index] = cuenta;
      localStorage.setItem(this.c, JSON.stringify(registros));
      return 1;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  getNuevoId(): number {
    let registros = this.getCuentas();
    try {
      let nuevo = Math.max.apply(Math, registros.map(function (e) { return e.idcuenta; })) + 1;
      return nuevo;
    } catch (error) {
      return 1;
    }
  }

  deleteCuenta(idcuenta: number):boolean{
    let registros: Array<Cuenta> = this.getCuentas();
    try {
      let index: number = registros.map(function (e) { return e.idcuenta; }).indexOf(idcuenta);
      if (index !== -1) {
        registros.splice(index, 1);
        localStorage.setItem(this.c, JSON.stringify(registros));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
