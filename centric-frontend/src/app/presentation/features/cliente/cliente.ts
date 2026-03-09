import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { ClienteForm } from './components/cliente-form/cliente-form';
import { ClienteList } from './components/cliente-list/cliente-list';

@Component({
  selector: 'app-cliente',
  imports: [ClienteList, ClienteForm],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Clientes implements OnInit {
  private readonly clienteService = inject(ClienteService);

  listaClientes = signal<Cliente[]>([]);
  isLoading = signal<boolean>(false);
  clienteEnEdicion = signal<Cliente | null>(null);
  mostrarFormulario = signal<boolean>(false);
  terminoBusqueda = signal<string>('');

  clientesFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) return this.listaClientes();
    return this.listaClientes().filter(c =>
      c.nombres.toLowerCase().includes(termino) ||
      c.direccion.toLowerCase().includes(termino) ||
      c.telefono.includes(termino)
    );
  });

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.isLoading.set(true);
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.listaClientes.set(data);
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
    this.clienteEnEdicion.set(null);
    this.mostrarFormulario.set(true);
  }

  // Método adaptado para recibir el DTO emitido por el Dumb Component
  guardarCliente(formValue: Partial<Cliente>): void {
    this.isLoading.set(true);
    const clienteActual = this.clienteEnEdicion();

    if (clienteActual) {
      this.clienteService.updateCliente(clienteActual.clienteId, formValue as Cliente).subscribe({
        next: () => {
          this.cargarClientes();
          this.cancelarEdicion();
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.clienteService.createCliente(formValue as Cliente).subscribe({
        next: () => {
          this.cargarClientes();
          this.cancelarEdicion();
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  editarCliente(cliente: Cliente): void {
    this.clienteEnEdicion.set(cliente);
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
    this.clienteEnEdicion.set(null);
    this.mostrarFormulario.set(false);
  }
}