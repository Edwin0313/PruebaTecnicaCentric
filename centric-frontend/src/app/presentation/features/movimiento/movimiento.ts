import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Cliente } from '../../../core/models/cliente.model';
import { Cuenta } from '../../../core/models/cuenta.model';
import { Movimiento } from '../../../core/models/movimiento.model';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { CuentaService } from '../../../infrastructure/services/cuenta/cuenta.service';
import { MovimientoService } from '../../../infrastructure/services/movimiento/movimiento.service';
import { MovimientoForm } from './components/movimiento-form/movimiento-form';
import { MovimientoList } from './components/movimiento-list/movimiento-list';

@Component({
  selector: 'app-movimiento',
  imports: [MovimientoList, MovimientoForm],
  templateUrl: './movimiento.html',
  styleUrl: './movimiento.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Movimientos implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly cuentaService = inject(CuentaService);
  private readonly clienteService = inject(ClienteService);

  listaMovimientos = signal<Movimiento[]>([]);
  listaCuentas = signal<Cuenta[]>([]);
  listaClientes = signal<Cliente[]>([]);

  isLoading = signal<boolean>(false);
  mostrarFormulario = signal<boolean>(false);
  mensajeError = signal<string | null>(null);

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

  abrirFormulario(): void {
    this.mensajeError.set(null);
    this.mostrarFormulario.set(true);
  }

  // Recibe los datos crudos del Dumb Component y aplica la regla de negocio
  guardarMovimiento(formValue: { cuentaId: string, tipoMovimiento: string, valor: number }): void {
    this.isLoading.set(true);
    this.mensajeError.set(null);

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
        if (err.error && err.error.mensaje) {
          this.mensajeError.set(err.error.mensaje);
        } else {
          this.mensajeError.set('Ocurrió un error al registrar el movimiento.');
        }
      }
    });
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.mensajeError.set(null);
  }
}