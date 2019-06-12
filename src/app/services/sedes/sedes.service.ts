import { Injectable } from '@angular/core';
import { Sede } from 'src/app/models/sede.model';

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  private sede: string = "Sedes";

  constructor() { }

  getSedes(codigodepartamento: number): Array<Sede> {
    let res = <Sede[]>JSON.parse(localStorage.getItem(this.sede));
    return res.filter(item => item.codigodepartamento === codigodepartamento);
  }

  setSede(sedes: Sede[]): boolean {
    try {
      let codigodepartamento = sedes[0].codigodepartamento;
      let sedesAct = <Sede[]>JSON.parse(localStorage.getItem(this.sede));
      if (sedesAct !== null) {
        let sedesDep = sedesAct.filter(item => item.codigodepartamento === codigodepartamento);
        let index = sedesAct.map(function (e) { return e.codigodepartamento; }).indexOf(codigodepartamento);
        sedesAct.splice(index, sedesDep.length);
        sedes.forEach(element => {
          sedesAct.push(element);
        });
      }else{
        sedesAct = sedes;
      }
      localStorage.setItem(this.sede, JSON.stringify(sedesAct));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteSedes(codigodepto: number): boolean {
    try {
      let sedesAct = <Sede[]>JSON.parse(localStorage.getItem(this.sede));
      let sedesDep = sedesAct.filter(item => item.codigodepartamento === codigodepto);
      let index = sedesAct.map(function (e) { return e.codigodepartamento; }).indexOf(codigodepto);
      sedesAct.splice(index, sedesDep.length);
      localStorage.setItem(this.sede, JSON.stringify(sedesAct));
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
