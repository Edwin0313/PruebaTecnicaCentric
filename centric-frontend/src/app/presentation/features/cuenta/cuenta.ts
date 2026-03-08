import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Cliente } from '../../../core/models/cliente.model';
import { Cuenta } from '../../../core/models/cuenta.model';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { CuentaService } from '../../../infrastructure/services/cuenta/cuenta.service';
import { CuentaForm } from './components/cuenta-form/cuenta-form';
import { CuentaList } from './components/cuenta-list/cuenta-list';

@Component({
  selector: 'app-cuenta',
  imports: [CuentaList, CuentaForm],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cuentas implements OnInit {
  private readonly cuentaService = inject(CuentaService);
  private readonly clienteService = inject(ClienteService);

  listaCuentas = signal<Cuenta[]>([]);
  listaClientes = signal<Cliente[]>([]);
  isLoading = signal<boolean>(false);
  mostrarFormulario = signal<boolean>(false);
  cuentaEnEdicion = signal<Cuenta | null>(null);
  terminoBusqueda = signal<string>('');

  cuentasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) return this.listaCuentas();

    return this.listaCuentas().filter(c =>
      c.numeroCuenta.toLowerCase().includes(termino) ||
      c.tipoCuenta.toLowerCase().includes(termino)
    );
  });

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.isLoading.set(true);
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.listaClientes.set(clientes);
        this.cargarCuentas();
      },
      error: () => this.isLoading.set(false)
    });
  }

  cargarCuentas(): void {
    this.cuentaService.getCuentas().subscribe({
      next: (cuentas) => {
        this.listaCuentas.set(cuentas);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  abrirFormulario(): void {
    this.cuentaEnEdicion.set(null);
    this.mostrarFormulario.set(true);
  }

  guardarCuenta(formValue: Partial<Cuenta>): void {
    this.isLoading.set(true);
    const cuentaActual = this.cuentaEnEdicion();

    if (cuentaActual) {
      this.cuentaService.updateCuenta(cuentaActual.cuentaId, formValue as Cuenta).subscribe({
        next: () => {
          this.cargarCuentas();
          this.cerrarFormulario();
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.cuentaService.createCuenta(formValue as Cuenta).subscribe({
        next: () => {
          this.cargarCuentas();
          this.cerrarFormulario();
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  editarCuenta(cuenta: Cuenta): void {
    this.cuentaEnEdicion.set(cuenta);
    this.mostrarFormulario.set(true);
  }

  eliminarCuenta(id: string): void {
    if (confirm('¿Está seguro de eliminar esta cuenta?')) {
      this.isLoading.set(true);
      this.cuentaService.deleteCuenta(id).subscribe({
        next: () => this.cargarCuentas(),
        error: () => this.isLoading.set(false)
      });
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.cuentaEnEdicion.set(null);
  }
}