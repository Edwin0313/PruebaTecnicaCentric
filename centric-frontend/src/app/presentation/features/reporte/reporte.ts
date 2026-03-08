import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cliente } from '../../../core/models/cliente.model';
import { ReporteMovimiento } from '../../../core/models/reporte.model';
import { ClienteService } from '../../../infrastructure/services/cliente.service';
import { MovimientoService } from '../../../infrastructure/services/movimiento.service';

@Component({
  selector: 'app-reporte',
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
  templateUrl: './reporte.html',
  styleUrl: './reporte.css',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Reportes implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly clienteService = inject(ClienteService);
  private readonly fb = inject(FormBuilder);
  private readonly datePipe = inject(DatePipe);

  listaReporte = signal<ReporteMovimiento[]>([]);
  listaClientes = signal<Cliente[]>([]);
  isLoading = signal<boolean>(false);
  busquedaRealizada = signal<boolean>(false);

  // Formulario para los parámetros de búsqueda
  filtroForm = this.fb.nonNullable.group({
    clienteId: ['', [Validators.required]],
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => this.listaClientes.set(clientes),
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  generarReporte(): void {
    if (this.filtroForm.invalid) {
      this.filtroForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { fechaInicio, fechaFin, clienteId } = this.filtroForm.getRawValue();

    this.movimientoService.getReporte(fechaInicio, fechaFin, clienteId).subscribe({
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
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Estado de Cuenta', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const { fechaInicio, fechaFin } = this.filtroForm.getRawValue();
    doc.text(`Periodo: ${fechaInicio} al ${fechaFin}`, 14, 28);
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
    doc.save(`Estado_Cuenta_${fechaInicio}_al_${fechaFin}.pdf`);
  }
}