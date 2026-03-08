import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Cliente } from '../../../../../core/models/cliente.model';
import { Cuenta } from '../../../../../core/models/cuenta.model';

@Component({
    selector: 'app-cuenta-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: '../../cuenta.css',
    template: `
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Saldo Inicial</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                @for (cuenta of cuentas(); track cuenta.cuentaId) {
                <tr>
                    <td><strong>{{ cuenta.numeroCuenta }}</strong></td>
                    <td>{{ cuenta.tipoCuenta }}</td>
                    <td>{{ obtenerNombreCliente(cuenta.clienteId) }}</td>
                    <td>\${{ cuenta.saldoInicial }}</td>
                    <td>
                        <span class="badge" [class.badge-active]="cuenta.estado"
                            [class.badge-inactive]="!cuenta.estado">
                            {{ cuenta.estado ? 'Activa' : 'Inactiva' }}
                        </span>
                    </td>
                    <td class="action-cells">
                        <button type="button" class="btn-icon" (click)="editar.emit(cuenta)" title="Editar">✏️</button>
                        <button type="button" class="btn-icon" (click)="eliminar.emit(cuenta.cuentaId)" title="Eliminar">🗑️</button>
                    </td>
                </tr>
                } @empty {
                <tr>
                    <td colspan="6" class="empty-state">No hay cuentas registradas.</td>
                </tr>
                }
            </tbody>
        </table>
    </div>
  `
})
export class CuentaList {
    cuentas = input.required<Cuenta[]>();
    clientes = input.required<Cliente[]>();

    editar = output<Cuenta>();
    eliminar = output<string>();

    obtenerNombreCliente(clienteId: string): string {
        const cliente = this.clientes().find(c => c.clienteId === clienteId);
        return cliente ? cliente.nombres : 'Desconocido';
    }
}