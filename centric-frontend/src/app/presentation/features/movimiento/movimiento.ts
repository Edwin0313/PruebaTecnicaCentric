import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../core/models/cliente.model';
import { Cuenta } from '../../../core/models/cuenta.model';
import { Movimiento } from '../../../core/models/movimiento.model';
import { ClienteService } from '../../../infrastructure/services/cliente.service';
import { CuentaService } from '../../../infrastructure/services/cuenta.service';
import { MovimientoService } from '../../../infrastructure/services/movimiento.service';

@Component({
  selector: 'app-movimiento',
  imports: [ReactiveFormsModule, DatePipe], // DatePipe para formatear la fecha en la tabla
  templateUrl: './movimiento.html',
  styleUrl: './movimiento.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Movimientos implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly cuentaService = inject(CuentaService);
  private readonly clienteService = inject(ClienteService);
  private readonly fb = inject(FormBuilder);

  listaMovimientos = signal<Movimiento[]>([]);
  listaCuentas = signal<Cuenta[]>([]);
  listaClientes = signal<Cliente[]>([]);
  isLoading = signal<boolean>(false);
  mostrarFormulario = signal<boolean>(false);
  mensajeError = signal<string | null>(null); // Señal exclusiva para el error de Saldo

  movimientoForm = this.fb.nonNullable.group({
    cuentaId: ['', [Validators.required]],
    tipoMovimiento: ['Depósito', [Validators.required]],
    valor: [0, [Validators.required, Validators.min(0.01)]] // Validamos que al menos digite 1 centavo
  });

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.isLoading.set(true);
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.listaClientes.set(clientes);
        this.cuentaService.getCuentas().subscribe({
          next: (cuentas) => {
            this.listaCuentas.set(cuentas);
            this.cargarMovimientos();
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => this.isLoading.set(false)
    });
  }

  cargarMovimientos(): void {
    this.movimientoService.getMovimientos().subscribe({
      next: (movs) => {
        this.listaMovimientos.set(movs);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
  obtenerNumeroCuenta(cuentaId: string): string {
    const cuenta = this.listaCuentas().find(c => c.cuentaId === cuentaId);
    return cuenta ? cuenta.numeroCuenta : 'Desconocida';
  }

  obtenerNombreClientePorCuenta(cuentaId: string): string {
    const cuenta = this.listaCuentas().find(c => c.cuentaId === cuentaId);
    if (!cuenta) return 'Desconocido';
    const cliente = this.listaClientes().find(c => c.clienteId === cuenta.clienteId);
    return cliente ? cliente.nombres : 'Desconocido';
  }

  abrirFormulario(): void {
    this.movimientoForm.reset({ tipoMovimiento: 'Depósito', valor: 0, cuentaId: '' });
    this.mensajeError.set(null); // Limpiar errores previos
    this.mostrarFormulario.set(true);
  }

  guardarMovimiento(): void {
    if (this.movimientoForm.invalid) {
      this.movimientoForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.mensajeError.set(null);

    const formValue = this.movimientoForm.getRawValue();

    // Regla de Transformación: Si es retiro, el valor va al backend en negativo
    let valorFinal = formValue.valor;
    if (formValue.tipoMovimiento === 'Retiro') {
      valorFinal = -Math.abs(valorFinal);
    } else {
      valorFinal = Math.abs(valorFinal);
    }

    const payload: Movimiento = {
      cuentaId: formValue.cuentaId,
      tipoMovimiento: formValue.tipoMovimiento,
      valor: valorFinal
    };

    this.movimientoService.createMovimiento(payload).subscribe({
      next: () => {
        this.cargarMovimientos();
        this.cerrarFormulario();
      },
      error: (err) => {
        this.isLoading.set(false);
        // Atrapamos el error exacto que programamos en .NET
        if (err.error && err.error.mensaje) {
          this.mensajeError.set(err.error.mensaje);
        } else {
          this.mensajeError.set('Ocurrió un error al registrar el movimiento.');
        }
      }
    });
  }

  cerrarFormulario(): void {
    this.movimientoForm.reset();
    this.mostrarFormulario.set(false);
    this.mensajeError.set(null);
  }
}