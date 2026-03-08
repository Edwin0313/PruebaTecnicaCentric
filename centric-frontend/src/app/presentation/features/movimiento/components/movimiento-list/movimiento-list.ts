import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Cliente } from '../../../../../core/models/cliente.model';
import { Cuenta } from '../../../../../core/models/cuenta.model';
import { Movimiento } from '../../../../../core/models/movimiento.model';

@Component({
    selector: 'app-movimiento-list',
    imports: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: '../../movimiento.css',
    template: `
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Número de Cuenta</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Saldo Disponible</th>
                </tr>
            </thead>
            <tbody>
                @for (mov of movimientos(); track mov.movimientoId) {
                <tr>
                    <td>{{ mov.fecha | date:'short' }}</td>
                    <td>{{ obtenerNombreClientePorCuenta(mov.cuentaId) }}</td>
                    <td><strong>{{ obtenerNumeroCuenta(mov.cuentaId) }}</strong></td>
                    <td>
                        <span class="badge" [class.badge-active]="mov.tipoMovimiento === 'Depósito'"
                            [class.badge-inactive]="mov.tipoMovimiento === 'Retiro'">
                            {{ mov.tipoMovimiento }}
                        </span>
                    </td>
                    <td>
                        <strong [class.text-danger]="mov.valor < 0" [class.text-success]="mov.valor > 0">
                            \${{ mov.valor }}
                        </strong>
                    </td>
                    <td><strong>\${{ mov.saldo }}</strong></td>
                </tr>
                } @empty {
                <tr>
                    <td colspan="6" class="empty-state">No hay movimientos registrados.</td>
                </tr>
                }
            </tbody>
        </table>
    </div>
  `
})
export class MovimientoList {
    movimientos = input.required<Movimiento[]>();
    cuentas = input.required<Cuenta[]>();
    clientes = input.required<Cliente[]>();

    obtenerNumeroCuenta(cuentaId: string): string {
        const cuenta = this.cuentas().find(c => c.cuentaId === cuentaId);
        return cuenta ? cuenta.numeroCuenta : 'Desconocida';
    }
    obtenerNombreClientePorCuenta(cuentaId: string): string {
        const cuenta = this.cuentas().find(c => c.cuentaId === cuentaId);
        if (!cuenta) return 'Desconocido';
        const cliente = this.clientes().find(c => c.clienteId === cuenta.clienteId);
        return cliente ? cliente.nombres : 'Desconocido';
    }
}