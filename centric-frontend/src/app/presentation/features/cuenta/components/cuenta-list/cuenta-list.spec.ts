import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Cliente } from '../../../../../core/models/cliente.model';
import { Cuenta } from '../../../../../core/models/cuenta.model';
import { CuentaList } from './cuenta-list';

describe('CuentaList (Dumb Component)', () => {
    let component: CuentaList;
    let fixture: ComponentFixture<CuentaList>;

    const mockCuentas: Cuenta[] = [
        { cuentaId: '1', numeroCuenta: '222222', tipoCuenta: 'Ahorros', saldoInicial: 500, estado: true, clienteId: '100' }
    ];

    const mockClientes: Cliente[] = [
        { clienteId: '100', nombres: 'Prueba Cliente', direccion: '', telefono: '', contrasena: '', estado: true }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CuentaList],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(CuentaList);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('cuentas', mockCuentas);
        fixture.componentRef.setInput('clientes', mockClientes);
        await fixture.whenStable();
    });

    it('debe renderizar la tabla con la cuenta y cruzar el nombre del cliente', () => {
        const filas = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(filas.length).toBe(1);
        const contenidoFila = filas[0].nativeElement.textContent;
        expect(contenidoFila).toContain('222222');
        expect(contenidoFila).toContain('Prueba Cliente'); // Validamos el cruce de datos
    });

    it('debe emitir el evento "eliminar" al hacer clic en el botón', () => {
        const emitSpy = jest.spyOn(component.eliminar, 'emit');
        const btnEliminar = fixture.debugElement.queryAll(By.css('.btn-icon'))[1].nativeElement;
        btnEliminar.click();
        expect(emitSpy).toHaveBeenCalledWith('1');
    });
});