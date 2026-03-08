import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { CuentaService } from '../../../infrastructure/services/cuenta/cuenta.service';
import { MovimientoService } from '../../../infrastructure/services/movimiento/movimiento.service';
import { Movimientos } from './movimiento';

describe('Movimientos (Smart Component)', () => {
  let component: Movimientos;
  let fixture: ComponentFixture<Movimientos>;
  let movService: any;

  beforeEach(async () => {
    movService = { getMovimientos: jest.fn().mockReturnValue(of([])), createMovimiento: jest.fn() };
    const cuenService = { getCuentas: jest.fn().mockReturnValue(of([])) };
    const cliService = { getClientes: jest.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      imports: [Movimientos],
      providers: [
        { provide: MovimientoService, useValue: movService },
        { provide: CuentaService, useValue: cuenService },
        { provide: ClienteService, useValue: cliService },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Movimientos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe transformar Retiro a valor negativo antes de enviar al service', () => {
    movService.createMovimiento.mockReturnValue(of({}));
    component.guardarMovimiento({ cuentaId: '1', tipoMovimiento: 'Retiro', valor: 100 });

    expect(movService.createMovimiento).toHaveBeenCalledWith(
      expect.objectContaining({ valor: -100 })
    );
  });

  it('debe capturar error de "Saldo no disponible" del backend', () => {
    const errorBody = { error: { mensaje: 'Saldo no disponible' } };
    movService.createMovimiento.mockReturnValue(throwError(() => errorBody));

    component.guardarMovimiento({ cuentaId: '1', tipoMovimiento: 'Retiro', valor: 500 });

    expect(component.mensajeError()).toBe('Saldo no disponible');
    expect(component.isLoading()).toBeFalsy();
  });

  it('debe limpiar errores al abrir el formulario', () => {
    component.mensajeError.set('Error previo');
    component.abrirFormulario();
    expect(component.mensajeError()).toBeNull();
  });
});