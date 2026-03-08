import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../core/models/cliente.model';
import { Cuenta } from '../../../core/models/cuenta.model';
import { ClienteService } from '../../../infrastructure/services/cliente.service';
import { CuentaService } from '../../../infrastructure/services/cuenta.service';

@Component({
  selector: 'app-cuenta',
  imports: [ReactiveFormsModule],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cuentas implements OnInit {
  private readonly cuentaService = inject(CuentaService);
  private readonly clienteService = inject(ClienteService);
  private readonly fb = inject(FormBuilder);

  listaCuentas = signal<Cuenta[]>([]);
  listaClientes = signal<Cliente[]>([]);
  isLoading = signal<boolean>(false);
  mostrarFormulario = signal<boolean>(false);
  cuentaEnEdicion = signal<Cuenta | null>(null);
  terminoBusqueda = signal<string>('');

  cuentaForm = this.fb.nonNullable.group({
    numeroCuenta: ['', [Validators.required, Validators.maxLength(20)]],
    tipoCuenta: ['Ahorros', [Validators.required]],
    saldoInicial: [0, [Validators.required, Validators.min(0)]],
    estado: [true],
    clienteId: ['', [Validators.required]]
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
      error: (err) => {
        console.error('Error al cargar clientes', err);
        this.isLoading.set(false);
      }
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

  abrirFormulario(): void {
    this.cuentaForm.reset({ tipoCuenta: 'Ahorros', saldoInicial: 0, estado: true, clienteId: '' });
    this.cuentaEnEdicion.set(null);
    this.cuentaForm.controls.saldoInicial.enable();
    this.mostrarFormulario.set(true);
  }
  cuentasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) return this.listaCuentas();
    return this.listaCuentas().filter(c =>
      c.numeroCuenta.toLowerCase().includes(termino) ||
      c.tipoCuenta.toLowerCase().includes(termino) ||
      c.saldoInicial.toString().includes(termino)
    );
  });

  actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  guardarCuenta(): void {
    if (this.cuentaForm.invalid) {
      this.cuentaForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.cuentaForm.getRawValue();
    const cuentaActual = this.cuentaEnEdicion();

    if (cuentaActual) {
      this.cuentaService.updateCuenta(cuentaActual.cuentaId, formValue).subscribe({
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
    this.cuentaForm.patchValue({
      numeroCuenta: cuenta.numeroCuenta,
      tipoCuenta: cuenta.tipoCuenta,
      saldoInicial: cuenta.saldoInicial,
      estado: cuenta.estado,
      clienteId: cuenta.clienteId
    });
    this.cuentaForm.controls.saldoInicial.disable();
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
    this.cuentaForm.reset();
    this.mostrarFormulario.set(false);
    this.cuentaEnEdicion.set(null);
  }

  obtenerNombreCliente(clienteId: string): string {
    const cliente = this.listaClientes().find(c => c.clienteId === clienteId);
    return cliente ? cliente.nombres : 'Desconocido';
  }
}