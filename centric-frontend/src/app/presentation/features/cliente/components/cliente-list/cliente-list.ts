import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Cliente } from '../../../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-responsive">
      <table aria-labelledby="page-title">
        <thead>
          <tr>
            <th scope="col">Nombres</th>
            <th scope="col">Dirección</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (cliente of clientes(); track cliente.clienteId) {
            <tr>
              <td>{{ cliente.nombres }}</td>
              <td>{{ cliente.direccion }}</td>
              <td>{{ cliente.telefono }}</td>
              <td>
                <span class="badge" [class.badge-active]="cliente.estado" [class.badge-inactive]="!cliente.estado">
                  {{ cliente.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="action-cells">
                <button type="button" class="btn-icon edit" (click)="editar.emit(cliente)" aria-label="Editar cliente">✏️</button>
                <button type="button" class="btn-icon delete" (click)="eliminar.emit(cliente.clienteId)" aria-label="Eliminar cliente">🗑️</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="empty-state">No hay clientes registrados o que coincidan con la búsqueda.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: '../../cliente.css'
})
export class ClienteList {
  clientes = input.required<Cliente[]>();

  editar = output<Cliente>();
  eliminar = output<string>();
}