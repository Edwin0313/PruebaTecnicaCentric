import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { MovimientoService } from '../../../infrastructure/services/movimiento/movimiento.service';
import { Reportes } from './reporte';

describe('Reportes (Smart Component)', () => {
  let component: Reportes;
  let fixture: ComponentFixture<Reportes>;
  let movService: any;
  let cliService: any;

  beforeEach(async () => {
    movService = { getReporte: jest.fn().mockReturnValue(of([])) };
    cliService = { getClientes: jest.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      imports: [Reportes],
      providers: [
        { provide: MovimientoService, useValue: movService },
        { provide: ClienteService, useValue: cliService },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Reportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe cargar clientes al iniciar', () => {
    expect(cliService.getClientes).toHaveBeenCalled();
  });

  it('debe llamar al servicio de movimientos con los filtros correctos', () => {
    const filtros = { clienteId: '123', fechaInicio: '2024-01-01', fechaFin: '2024-01-31' };
    component.generarReporte(filtros);

    expect(movService.getReporte).toHaveBeenCalledWith('2024-01-01', '2024-01-31', '123');
    expect(component.busquedaRealizada()).toBeTruthy();
    expect(component.filtrosActuales()).toEqual(filtros);
  });

  it('debe manejar errores del servidor al generar el reporte', () => {
    window.alert = jest.fn(); // Mock de la alerta
    movService.getReporte.mockReturnValue(throwError(() => new Error('Server Error')));

    component.generarReporte({ clienteId: '1', fechaInicio: '2024-01-01', fechaFin: '2024-01-02' });

    expect(component.isLoading()).toBeFalsy();
    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al generar el reporte.');
  });

  it('debe ejecutar la exportación a PDF (validación de llamada)', () => {
    component.filtrosActuales.set({ clienteId: '1', fechaInicio: '2024-01-01', fechaFin: '2024-01-02' });
    // No probamos la lógica interna de jsPDF (es librería externa), solo que el método no rompa
    expect(() => component.exportarPDF()).not.toThrow();
  });
});