import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { CuentaService } from '../../../infrastructure/services/cuenta/cuenta.service';
import { Cuentas } from './cuenta';

describe('Cuentas (Smart Component)', () => {
  let component: Cuentas;
  let fixture: ComponentFixture<Cuentas>;
  let cuenService: any;

  beforeEach(async () => {
    cuenService = {
      getCuentas: jest.fn().mockReturnValue(of([])),
      createCuenta: jest.fn().mockReturnValue(of({})),
      updateCuenta: jest.fn().mockReturnValue(of({})),
      deleteCuenta: jest.fn().mockReturnValue(of({}))
    };
    const cliService = { getClientes: jest.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      imports: [Cuentas],
      providers: [
        { provide: CuentaService, useValue: cuenService },
        { provide: ClienteService, useValue: cliService },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cuentas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe llamar a createCuenta cuando se guarda una cuenta nueva', () => {
    component.cuentaEnEdicion.set(null);
    component.guardarCuenta({ numeroCuenta: '123' });
    expect(cuenService.createCuenta).toHaveBeenCalled();
  });

  it('debe llamar a updateCuenta cuando se está editando', () => {
    const cuentaExistente = { cuentaId: '99', numeroCuenta: '123' };
    component.cuentaEnEdicion.set(cuentaExistente as any);
    component.guardarCuenta({ numeroCuenta: '123-MOD' });
    expect(cuenService.updateCuenta).toHaveBeenCalledWith('99', expect.anything());
  });

  it('debe solicitar confirmación antes de eliminar', () => {
    window.confirm = jest.fn().mockReturnValue(true);
    component.eliminarCuenta('1');
    expect(cuenService.deleteCuenta).toHaveBeenCalledWith('1');
  });
});