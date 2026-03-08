import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReporteMovimiento } from '../../../../../core/models/reporte.model';

@Component({
    selector: 'app-reporte-list',
    imports: [DatePipe, CurrencyPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: '../../reporte.css',
    template: `
    @if (busquedaRealizada()) {
    <div class="actions-container" style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
        <button type="button" class="btn btn-primary" (click)="exportarPdf.emit()" [disabled]="!listaReporte().length">
            Exportar a PDF
        </button>
    </div>

    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Número Cuenta</th>
                    <th>Tipo</th>
                    <th>Saldo Inicial</th>
                    <th>Estado</th>
                    <th>Movimiento</th>
                    <th>Saldo Disponible</th>
                </tr>
            </thead>
            <tbody>
                @for (item of listaReporte(); track $index) {
                <tr>
                    <td>{{ item.fecha | date:'dd/MM/yyyy' }}</td>
                    <td>{{ item.cliente }}</td>
                    <td>{{ item.numeroCuenta }}</td>
                    <td>{{ item.tipo }}</td>
                    <td>{{ item.saldoInicial | currency }}</td>
                    <td>
                        <span class="badge" [class.badge-active]="item.estado" [class.badge-inactive]="!item.estado">
                            {{ item.estado ? 'Activa' : 'Inactiva' }}
                        </span>
                    </td>
                    <td>
                        <strong [class.text-danger]="item.movimiento < 0" [class.text-success]="item.movimiento > 0">
                            {{ item.movimiento | currency }}
                        </strong>
                    </td>
                    <td><strong>{{ item.saldoDisponible | currency }}</strong></td>
                </tr>
                } @empty {
                <tr>
                    <td colspan="8" class="empty-state">No se encontraron movimientos para los filtros seleccionados.</td>
                </tr>
                }
            </tbody>
        </table>
    </div>
    }
  `
})
export class ReporteList {
    listaReporte = input.required<ReporteMovimiento[]>();
    busquedaRealizada = input.required<boolean>();

    exportarPdf = output<void>();
}