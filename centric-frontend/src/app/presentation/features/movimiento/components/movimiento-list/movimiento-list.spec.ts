import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoList } from './movimiento-list';

describe('MovimientoList', () => {
    let component: MovimientoList;
    let fixture: ComponentFixture<MovimientoList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovimientoList],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(MovimientoList);
        component = fixture.componentInstance;

        // Seteamos inputs requeridos
        fixture.componentRef.setInput('movimientos', [{ cuentaId: 'A1', valor: 50, tipoMovimiento: 'Depósito' }]);
        fixture.componentRef.setInput('cuentas', [{ cuentaId: 'A1', numeroCuenta: '999', clienteId: 'C1' }]);
        fixture.componentRef.setInput('clientes', [{ clienteId: 'C1', nombres: 'Prueba Senior' }]);

        await fixture.whenStable();
    });

    it('debe mostrar el nombre del cliente cruzado por cuentaId', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.textContent).toContain('Prueba Senior');
        expect(compiled.textContent).toContain('999');
    });
});