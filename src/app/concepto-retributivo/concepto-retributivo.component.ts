import { Component, OnInit } from '@angular/core';
import { Concepto } from '../models/concepto.model';
import { ConceptoService } from '../services/concepto/concepto.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-concepto-retributivo',
  templateUrl: './concepto-retributivo.component.html',
  styleUrls: ['./concepto-retributivo.component.css']
})
export class ConceptoRetributivoComponent implements OnInit {

  listaDeConceptos: Array<Concepto> = [];
  actualizando: boolean = false;
  concepto: Concepto = { codigo: null, descripcion: null };

  constructor(private conceptosservice: ConceptoService) { }

  ngOnInit() {
    this.listaDeConceptos = this.conceptosservice.getConceptos();
  }

  frmConcepto = new FormGroup({
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required)
  });

  get codigo() {
    return this.frmConcepto.get("codigo");
  }

  guardarConcepto() {
    if (this.frmConcepto.valid) {
      let res: boolean = false;
      if (!this.actualizando) res = this.conceptosservice.setConcepto(this.concepto);
      else res = this.conceptosservice.updateConcepto(this.concepto);
      if (res) {
        this.listaDeConceptos = this.conceptosservice.getConceptos();
        alert("Concepto " + (this.actualizando ? "actualizado" : "creado") + " exitosamente!");
        this.limpiar();
      }
    }
    else alert("Debe llenar los campos.");
  }

  cargarConcepto(con: Concepto) {
    this.actualizando = true;
    this.codigo.disable();
    this.concepto.codigo = con.codigo;
    this.concepto.descripcion = con.descripcion;
  }

  eliminarConcepto(codigo: number) {
    if (this.conceptosservice.deleteConcepto(codigo)) {
      let index:number = this.listaDeConceptos.map(function(e){return e.codigo}).indexOf(codigo);
      if (index !== -1) this.listaDeConceptos.splice(index,1);
      alert("Concepto eliminado exitosamente");
      this.limpiar();
    }
  }

  limpiar() {
    this.actualizando = false;
    this.codigo.enable();
    this.concepto = {codigo:null, descripcion:null};
  }

}
