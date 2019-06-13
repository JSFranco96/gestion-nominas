import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Empleado } from '../models/empleado.model';
import { Departamento } from '../models/departamento.model';
import { Sede } from '../models/sede.model';
import { EmpleadosService } from '../services/empleados/empleados.service';
import { DepartamentosService } from '../services/departamentos/departamentos.service';
import { SedesService } from '../services/sedes/sedes.service';
import { Trabaja } from '../models/trabaja.model';
import { Cuenta } from '../models/cuenta.model';
import { CuentasService } from '../services/cuentas/cuentas.service';
import { FuncionesService } from '../services/funciones/funciones.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  actualizando: boolean = false;

  empleado: Empleado = { codigo: null, nif: null, nombre: null, numerohijos: null, retencion: null, idcuenta: null };
  cuenta: Cuenta = { idcuenta: null, codigobanco: null, codigosucursal: null, numcuenta: null };
  funcion: Trabaja = { codigodepartamento: null, codigoempleado: null, funcion: null };
  departamento = { codigoDepto: 0, nomdepto: "", funcion: null };

  listaDeEmpleados: Array<Empleado> = [];
  listaDeDepartamentos: Array<Departamento> = [];
  listaDeSedes: Array<Sede> = [];
  listaDeFunciones: Array<Trabaja> = [];
  listaDeDepartamentosAux: Array<any> = [];

  constructor(
    private empleadosservice: EmpleadosService,
    private deptosservice: DepartamentosService,
    private sedesservice: SedesService,
    private cuentasservice: CuentasService,
    private funcionesservice: FuncionesService) { }

  ngOnInit() {
    this.listaDeEmpleados = this.empleadosservice.getEmpleados();
    this.listaDeDepartamentos = this.deptosservice.getDepartamentos();
  }

  frmEmpleado = new FormGroup({
    codigo: new FormControl('', Validators.required),
    nif: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    numerohijos: new FormControl('', Validators.required),
    retencion: new FormControl('', Validators.required),
  });


  frmCuenta = new FormGroup({
    codigobanco: new FormControl('', Validators.required),
    codigosucursal: new FormControl('', Validators.required),
    numerocuenta: new FormControl('', Validators.required)
  });

  frmDepartamento = new FormGroup({
    codigoDepartamento: new FormControl('', Validators.required),
    funcion: new FormControl('', Validators.required)
  });

  get codigo() {
    return this.frmEmpleado.get("codigo");
  }

  onChangeDepto(value) {
    if (this.departamento.codigoDepto) {
      this.listaDeSedes = this.sedesservice.getSedes(this.departamento.codigoDepto);
      let codigo = value.split(":")[1].trim();
      let depto = this.listaDeDepartamentos.filter(item => item.codigo === codigo)[0];
      this.departamento.nomdepto = depto.nombre;
    }
  }

  agregarDepto() {
    if (this.frmDepartamento.valid) {
      this.listaDeDepartamentosAux.push(this.departamento);
      this.departamento = { codigoDepto: 0, nomdepto: "", funcion: "" };
    } else {
      alert("Debe llenar todos los campos del departamento.")
    }
  }

  removerDepartamento(codigo: number) {
    let index: number = this.listaDeDepartamentosAux.map(function (e) { return e.codigoDepto }).indexOf(codigo);
    this.listaDeDepartamentosAux.splice(index, 1);
  }

  cargarEmpleado(emp: Empleado) {
    this.actualizando = true;
    this.codigo.disable();
    this.empleado = emp;
    this.cuenta = this.cuentasservice.getCuentaXId(this.empleado.idcuenta);
    let funcionesAux = this.funcionesservice.getFunciones(emp.codigo);
    this.listaDeDepartamentosAux = [];
    let nomdeptoAux: string = String();
    let nomsedeAux: string = String();
    funcionesAux.forEach(element => {
      nomdeptoAux = this.listaDeDepartamentos.filter(item => item.codigo === element.codigodepartamento)[0].nombre
      this.listaDeDepartamentosAux.push({
        codigoDepto: element.codigodepartamento,
        nomdepto: nomdeptoAux,
        funcion: element.funcion
      });
    });
  }

  eliminarEmpleado(emp: Empleado) {
    if (this.empleadosservice.deleteEmpleado(emp.codigo)) {
      if (this.cuentasservice.deleteCuenta(emp.idcuenta)) {
        if (this.funcionesservice.deleteFunciones(emp.codigo)) {
          let index: number = this.listaDeEmpleados.map(function (e) { return e.codigo }).indexOf(emp.codigo)
          if (index !== -1) this.listaDeEmpleados.splice(index, 1);
          alert("Empleado eliminado exitosamente");
          this.limpiar();
        } else alert("Ocurrió un error eliminando las funciones");
      } else alert("Ocurrió un error eliminado la cuenta");
    } else alert("Ocurrió un error eliminando el empleado");
  }

  guardarEmpleado() {
    if (this.frmEmpleado.valid && this.frmCuenta.valid && this.listaDeDepartamentosAux.length) {
      let resCuenta: number = 0;
      if (!this.actualizando) {
        resCuenta = this.cuentasservice.setCuenta(this.cuenta);
      } else {
        resCuenta = this.cuentasservice.updateCuenta(this.cuenta);
      }
      if (resCuenta > 0) {
        let resEmpleado: boolean = false;
        if (!this.actualizando) {
          this.empleado.idcuenta = resCuenta;
          resEmpleado = this.empleadosservice.setEmpleado(this.empleado);
        } else {
          resEmpleado = this.empleadosservice.updateEmpleado(this.empleado);
        }
        if (resEmpleado) {
          this.llenarListaDeFunciones();
          let resFunciones: boolean = this.funcionesservice.setFunciones(this.listaDeFunciones);
          if (resFunciones) {
            this.listaDeEmpleados = this.empleadosservice.getEmpleados();
            alert("Empleado " + (this.actualizando ? "actualizado" : "creado") + " exitosamente!");
            this.limpiar();
          }
          else {
            this.empleadosservice.deleteEmpleado(this.empleado.codigo);
            alert("Ocurrió un error " + (this.actualizando ? "actualizando" : "creando") + " las funciones.");
          }
        }
        else {
          this.cuentasservice.deleteCuenta(this.empleado.idcuenta);
          alert("Ocurrió un error " + (this.actualizando ? "actualizando" : "creando") + " el empleado.");
        }
      }
      else alert("Ocurrió un error " + (this.actualizando ? "actualizando" : "creando") + " la cuenta.");
    }
    else {
      if(!this.frmEmpleado.valid) alert("Debe llenar los campos del empleado");
      else if(!this.frmCuenta.valid) alert("Debe llenar los campos de la cuenta");
      else alert("Debe agregar al menos un departamento al empleado");
    }
  }

  llenarListaDeFunciones() {
    this.listaDeDepartamentosAux.forEach(element => {
      this.listaDeFunciones.push({
        codigodepartamento: element.codigoDepto,
        codigoempleado: this.empleado.codigo,
        funcion: element.funcion
      });
    });
  }

  limpiar() {
    this.actualizando = false;
    this.empleado = { codigo: null, nombre: null, nif: null, numerohijos: null, retencion: null, idcuenta: null }
    this.cuenta = { idcuenta: null, codigobanco: null, codigosucursal: null, numcuenta: null }
    this.listaDeDepartamentosAux = [];
    this.codigo.enable();
    this.listaDeFunciones = [];
    this.listaDeEmpleados = this.empleadosservice.getEmpleados();
  }

}
