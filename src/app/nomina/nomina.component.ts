import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Empleado } from '../models/empleado.model';
import { Concepto } from '../models/concepto.model';
import { Ingreso } from '../models/ingreso.model';
import { Descuento } from '../models/descuento.model';
import { EmpleadosService } from '../services/empleados/empleados.service';
import { ConceptoService } from '../services/concepto/concepto.service';
import { IngresoService } from '../services/ingreso/ingreso.service';
import { DescuentoService } from '../services/descuento/descuento.service';
import { Cuenta } from '../models/cuenta.model';
import { CuentasService } from '../services/cuentas/cuentas.service';
import { Nomina } from '../models/nomina.model';
import { NominaService } from '../services/nomina/nomina.service';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent implements OnInit {

  actualizando: boolean = false;
  empleadoSeleccionado: number = 0;

  empleado: Empleado = { codigo: 0, nombre: null, idcuenta: null, retencion: null, nif: null, numerohijos: null };
  nomina: any = { codigoEmp: null, nombreEmp: null, ejercicio: null, mes: null, orden: null, ingresos: null, descuentos: null, idnomina: null };
  nominaG: Nomina;
  concepto: Concepto = { codigo: 0, descripcion: null };
  ingreso: Ingreso = { concepto: null, contidad: null, idnomina: null, lienanumero: null };
  descuento: Descuento = { idnomina: null, base: null, cantidad: null, lineanumero: null, porcentaje: null };
  cuenta: Cuenta = { codigobanco: null, codigosucursal: null, numcuenta: null, idcuenta: null };

  listaDeEmpleados: Array<Empleado> = [];
  listaDeConceptos: Array<Concepto> = [];
  listaDeIngresos: Array<Ingreso> = [];
  listaDeDescuentos: Array<Descuento> = [];
  listaDeNomina: Array<any> = [];

  constructor(
    private empleadosservice: EmpleadosService,
    private conceptosservice: ConceptoService,
    private ingresosservice: IngresoService,
    private descuentosservice: DescuentoService,
    private cuentasservice: CuentasService,
    private nominasservice: NominaService
  ) { }

  ngOnInit() {
    this.listaDeEmpleados = this.empleadosservice.getEmpleados();
    this.listaDeConceptos = this.conceptosservice.getConceptos();
    this.cargarTodasNominas();
  }

  frmNomina = new FormGroup({
    empleados: new FormControl('', Validators.required),
    cuenta: new FormControl('', Validators.required),
    retencion: new FormControl('', Validators.required),
    ejercicio: new FormControl('', Validators.required),
    mes: new FormControl('', Validators.required),
    orden: new FormControl('', Validators.required)
  });

  frmIngresos = new FormGroup({
    concepto: new FormControl('', Validators.required),
    cantidadCon: new FormControl('', Validators.required),
  });

  frmDescuentos = new FormGroup({
    base: new FormControl('', Validators.required),
    porcentaje: new FormControl('', Validators.required),
    cantidadDes: new FormControl('', Validators.required)
  })

  get empleados() {
    return this.frmNomina.get("empleados");
  }

  //--
  onChangeEmpleado(value) {
    if (value !== null || value > 0) {
      let codigo = value.split(":")[1].trim();
      this.empleado = this.listaDeEmpleados.filter(item => item.codigo === codigo)[0];
      this.cuenta = this.cuentasservice.getCuentaXId(this.empleado.idcuenta)
    }
  }

  //--
  onChangeConcepto(value) {
    if (value !== null || value > 0) {
      let codigo = value.split(":")[1].trim();
      this.concepto = this.listaDeConceptos.filter(item => item.codigo === codigo)[0];
      this.ingreso.concepto = this.concepto.descripcion;
    }
  }

  //--
  agregarIngreso() {
    this.listaDeIngresos.push(this.ingreso)
    this.ingreso = { concepto: null, idnomina: null, lienanumero: null, contidad: null }
    this.concepto = { codigo: 0, descripcion: null };
  }

  //--
  removerIngreso(ingreso: Ingreso) {
    let index = this.listaDeIngresos.map(function (e) { return e }).indexOf(ingreso);
    this.listaDeIngresos.splice(index, 1);
  }

  //--
  agregarDescuento() {
    this.descuento.cantidad = this.descuento.base * this.descuento.porcentaje / 100;
    this.listaDeDescuentos.push(this.descuento);
    this.descuento = { idnomina: null, porcentaje: null, lineanumero: null, cantidad: null, base: null }
  }

  //--
  removerDescuento(descuento: Descuento) {
    let index = this.listaDeDescuentos.map(function (e) { return e }).indexOf(descuento);
    this.listaDeDescuentos.splice(index, 1);
  }

  //--
  guardarNomina() {
    if (this.frmNomina.valid && this.listaDeIngresos.length) {
      this.nominaG = {
        idcuenta: this.empleado.idcuenta,
        codigoempleado: this.empleado.codigo,
        ejerciciofiscal: this.nomina.ejercicio,
        idnomina: 0,
        mes: this.nomina.mes,
        numeroorden: this.nomina.orden
      }
      let res: number = 0;
      if (this.actualizando) res = this.nominasservice.updateNomina(this.nominaG);
      else res = this.nominasservice.setNomina(this.nominaG);
      if (res > 0) {
        let resIngresos: number = 0;
        this.listaDeIngresos.forEach(element => {
          element.idnomina = res;
        });
        resIngresos = this.ingresosservice.setIngreso(this.listaDeIngresos);
        if (resIngresos > 0) {
          let resDescuentos: boolean = false;
          this.listaDeDescuentos.forEach(element => {
            element.idnomina = res;
            element.lineanumero = resIngresos;
          });
          resDescuentos = this.descuentosservice.setDescuentos(this.listaDeDescuentos);
          if (resDescuentos) {
            if (!this.actualizando) {
              this.nominaG.idnomina = res;
            }
            let ing: number = 0
            this.listaDeIngresos.forEach(element => {
              ing += element.contidad;
            });
            let des: number = 0
            this.listaDeDescuentos.forEach(element => {
              des += element.cantidad
            });
            this.nomina.codigoEmp = this.empleado.codigo;
            this.nomina.nombreEmp = this.empleado.nombre;
            this.nomina.ingresos = ing;
            this.nomina.descuentos = (des * -1);
            this.nomina.total = ing - des
            this.nomina.idnomina = res;

            this.listaDeNomina.push(this.nomina);

            alert("Nómina " + (this.actualizando ? "actualizada" : "creada") + " exitosamente!");
            this.limpiar();
          }
        } else {
          this.nominasservice.deleteNomina(res);
        }
      }
    } else {
      alert("Debe llenar los campos.");
    }
  }


  //--
  cargarNomina(nomina) {
    alert("Sin implementar");
  }

  //--
  eliminarNomina(nomina) {
    if(this.nominasservice.deleteNomina(nomina.idnomina)){
      if(this.ingresosservice.deleteIngreso(nomina.idnomina)){
        if (this.descuentosservice.deleteDescuentos(nomina.idnomina)) {
          this.cargarTodasNominas();
          alert("Nómina eliminada exitosamente!");
        }
      }
    }
  }

  //--
  limpiar() {
    this.actualizando = false;
    // this.empleados.enable();
    this.listaDeDescuentos = [];
    this.listaDeIngresos = [];
    this.empleadoSeleccionado = 0;
    this.nomina = { codigoEmp: null, nombreEmp: null, ejercicio: null, mes: null, orden: null, ingresos: null, descuentos: null, idnomina: null };
  }

  cargarTodasNominas() {
    this.listaDeNomina = [];
    let lista = this.nominasservice.getNominas();

    let tingresos: number = 0;
    let tdescuentos: number = 0;
    let nombreEmp: string = String();
    lista.forEach(element => {
      tingresos = this.ingresosservice.getTotalXNomina(element.idnomina);
      tdescuentos = this.descuentosservice.getTotalXNomina(element.idnomina);
      nombreEmp = this.listaDeEmpleados.filter(item => item.codigo === element.codigoempleado)[0].nombre
      this.nomina.codigoEmp = element.codigoempleado;
      this.nomina.nombreEmp = nombreEmp;
      this.nomina.ejercicio = element.ejerciciofiscal;
      this.nomina.mes = element.mes;
      this.nomina.orden = element.numeroorden;
      this.nomina.ingresos = tingresos;
      this.nomina.descuentos = (tdescuentos * -1);
      this.nomina.total = tingresos - tdescuentos
      this.nomina.idnomina = element.idnomina

      this.listaDeNomina.push(this.nomina);
      this.nomina = { codigoEmp: null, nombreEmp: null, ejercicio: null, mes: null, orden: null, ingresos: null, descuentos: null, idnomina: null };
    });
  }

}
