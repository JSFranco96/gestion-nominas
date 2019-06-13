import { Injectable } from '@angular/core';
import { Nomina } from 'src/app/models/nomina.model';

@Injectable({
  providedIn: 'root'
})
export class NominaService {

  private n:string = "Nominas";

  constructor() { }

  getNominas(): Array<Nomina> {
    try {
      return <Nomina[]>JSON.parse(localStorage.getItem(this.n));
    } catch (error) {
      console.log(error);
      return new Array<Nomina>();
    }
  }

  setNomina(nomina: Nomina): number {
    try {
      nomina.idnomina = this.getNuevoId();
      let nominas: Array<Nomina> = new Array<Nomina>();
      let res = this.getNominas();
      nominas = res !== null ? res : nominas;
      nominas.push(nomina);
      localStorage.setItem(this.n, JSON.stringify(nominas));
      return nomina.idnomina;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  updateNomina(nomina: Nomina): number {
    let nom: Array<Nomina> = this.getNominas();
    try {
      let index: number = nom.map(function (e) { return e.idnomina }).indexOf(nomina.idnomina);
      if (index !== -1) {
        nom[index] = nomina;
        localStorage.setItem(this.n, JSON.stringify(nom));
        return nomina.idnomina;
      }
      return 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  deleteNomina(idnomina: number): boolean {
    let nom: Array<Nomina> = this.getNominas();
    try {
      let index: number = nom.map(function (e) { return e.idnomina; }).indexOf(idnomina);
      if (index !== -1) {
        nom.splice(index, 1);
        localStorage.setItem(this.n, JSON.stringify(nom));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  getNuevoId(): number {
    let registros = this.getNominas();
    try {
      let nuevo = Math.max.apply(Math, registros.map(function (e) { return e.idcuenta; })) + 1;
      return nuevo;
    } catch (error) {
      return 1;
    }
  }
}
