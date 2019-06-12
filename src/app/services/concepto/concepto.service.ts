import { Injectable } from '@angular/core';
import { Concepto } from 'src/app/models/concepto.model';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {

  private c: string ="Conceptos";
  constructor() { }

  getConceptos(): Array<Concepto> {
    return <Concepto[]>JSON.parse(localStorage.getItem(this.c));
  }

  setConcepto(concepto: Concepto): boolean {
    try {
      let con: Array<Concepto> = new Array<Concepto>()
      let res = this.getConceptos()
      con = res !== null ? res : con;
      con.push(concepto);
      localStorage.setItem(this.c, JSON.stringify(con));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  updateConcepto(concepto: Concepto): boolean {
    let con: Array<Concepto> = this.getConceptos();
    try {
      let index: number = con.map(function (e) { return e.codigo; }).indexOf(concepto.codigo);
      if (index !== -1) {
        con[index] = concepto;
        localStorage.setItem(this.c, JSON.stringify(con));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteConcepto(codigo: number): boolean {
    let con: Array<Concepto> = this.getConceptos();
    try {
      let index: number = con.map(function (e) { return e.codigo; }).indexOf(codigo);
      if (index !== -1) {
        con.splice(index, 1);
        localStorage.setItem(this.c, JSON.stringify(con));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
