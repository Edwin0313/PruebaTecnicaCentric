import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cliente } from '../../../core/models/cliente.model';
import { ReporteMovimiento } from '../../../core/models/reporte.model';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { MovimientoService } from '../../../infrastructure/services/movimiento/movimiento.service';
import { FiltroReporte, ReporteForm } from './components/reporte-form/reporte-form';
import { ReporteList } from './components/reporte-list/reporte-list';

@Component({
  selector: 'app-reporte',
  imports: [ReporteForm, ReporteList],
  templateUrl: './reporte.html',
  styleUrl: './reporte.css',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Reportes implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly clienteService = inject(ClienteService);
  private readonly datePipe = inject(DatePipe);

  listaReporte = signal<ReporteMovimiento[]>([]);
  listaClientes = signal<Cliente[]>([]);
  isLoading = signal<boolean>(false);
  busquedaRealizada = signal<boolean>(false);

  // Guardamos los filtros usados para poder pasarlos al PDF luego
  filtrosActuales = signal<FiltroReporte | null>(null);

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => this.listaClientes.set(clientes),
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  generarReporte(filtros: FiltroReporte): void {
    this.isLoading.set(true);
    this.filtrosActuales.set(filtros); // Guardamos el estado actual

    this.movimientoService.getReporte(filtros.fechaInicio, filtros.fechaFin, filtros.clienteId).subscribe({
      next: (datos) => {
        this.listaReporte.set(datos);
        this.busquedaRealizada.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        alert('Ocurrió un error al generar el reporte.');
      }
    });
  }

  exportarPDF(): void {
    const filtros = this.filtrosActuales();
    if (!filtros) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Estado de Cuenta', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Periodo: ${filtros.fechaInicio} al ${filtros.fechaFin}`, 14, 28);

    const datosTabla = this.listaReporte().map(item => [
      this.datePipe.transform(item.fecha, 'dd/MM/yyyy') || '',
      item.cliente,
      item.numeroCuenta,
      item.tipo,
      `$${item.saldoInicial}`,
      item.estado ? 'Activa' : 'Inactiva',
      `$${item.movimiento}`,
      `$${item.saldoDisponible}`
    ]);

    autoTable(doc, {
      head: [['Fecha', 'Cliente', 'Cuenta', 'Tipo', 'Saldo Inicial', 'Estado', 'Movimiento', 'Saldo Disponible']],
      body: datosTabla,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [0, 86, 179] }
    });

    doc.save(`Estado_Cuenta_${filtros.fechaInicio}_al_${filtros.fechaFin}.pdf`);
  }
}