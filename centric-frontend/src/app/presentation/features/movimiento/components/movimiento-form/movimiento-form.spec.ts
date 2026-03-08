import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoForm } from './movimiento-form';

describe('MovimientoForm', () => {
    let component: MovimientoForm;
    let fixture: ComponentFixture<MovimientoForm>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovimientoForm],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(MovimientoForm);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('listaCuentas', []);
        await fixture.whenStable();
    });

    it('debe emitir el evento guardar si el monto es mayor a cero', () => {
        const spy = jest.spyOn(component.guardar, 'emit');
        component.movimientoForm.patchValue({ cuentaId: '1', tipoMovimiento: 'Depósito', valor: 10 });
        component.onSubmit();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ valor: 10 }));
    });

    it('no debe emitir si el valor es 0 o negativo', () => {
        const spy = jest.spyOn(component.guardar, 'emit');
        component.movimientoForm.patchValue({ valor: -5 });
        component.onSubmit();
        expect(spy).not.toHaveBeenCalled();
    });
});