import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../infrastructure/services/cliente.service';

@Component({
  selector: 'app-cliente',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Clientes implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly fb = inject(FormBuilder);

  listaClientes = signal<Cliente[]>([]);
  isLoading = signal<boolean>(false);
  clienteEnEdicion = signal<Cliente | null>(null);
  mostrarFormulario = signal<boolean>(false);
  clienteForm = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(200)]],
    telefono: ['', [Validators.required, Validators.maxLength(20)]],
    contrasena: ['', [Validators.required]],
    estado: [true]
  });
  terminoBusqueda = signal<string>('');

  ngOnInit(): void {
    this.cargarClientes();
  }
  clientesFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) return this.listaClientes(); // Si no hay búsqueda, muestra todos

    return this.listaClientes().filter(c =>
      c.nombres.toLowerCase().includes(termino) ||
      c.direccion.toLowerCase().includes(termino) ||
      c.telefono.includes(termino)
    );
  });

  cargarClientes(): void {
    this.isLoading.set(true);
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.listaClientes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.isLoading.set(false);
      }
    });
  }
  actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  guardarCliente(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.clienteForm.getRawValue();
    const clienteActual = this.clienteEnEdicion();

    if (clienteActual) {
      this.clienteService.updateCliente(clienteActual.clienteId, formValue).subscribe({
        next: () => {
          this.cargarClientes();
          this.cancelarEdicion();
          this.mostrarFormulario.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.clienteService.createCliente(formValue).subscribe({
        next: () => {
          this.cargarClientes();
          this.cancelarEdicion();
          this.mostrarFormulario.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  editarCliente(cliente: Cliente): void {
    this.clienteEnEdicion.set(cliente);
    this.clienteForm.patchValue({
      nombres: cliente.nombres,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      contrasena: cliente.contrasena,
      estado: cliente.estado
    });
    this.mostrarFormulario.set(true);
  }

  eliminarCliente(id: string): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.isLoading.set(true);
      this.clienteService.deleteCliente(id).subscribe({
        next: () => this.cargarClientes(),
        error: () => this.isLoading.set(false)
      });
    }
  }

  cancelarEdicion(): void {
    this.clienteForm.reset();
    this.clienteEnEdicion.set(null);
    this.mostrarFormulario.set(false);
  }
  abrirFormulario(): void {
    this.clienteForm.reset({ estado: true });
    this.clienteEnEdicion.set(null);
    this.mostrarFormulario.set(true);
  }
}