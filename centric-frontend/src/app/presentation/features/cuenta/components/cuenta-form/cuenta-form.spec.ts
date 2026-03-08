import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CuentaForm } from './cuenta-form';

describe('CuentaForm (Dumb Component)', () => {
    let component: CuentaForm;
    let fixture: ComponentFixture<CuentaForm>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CuentaForm, ReactiveFormsModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(CuentaForm);
        component = fixture.componentInstance;

        // Inicializamos los inputs requeridos para que no falle al renderizar
        fixture.componentRef.setInput('cuentaEnEdicion', null);
        fixture.componentRef.setInput('listaClientes', [
            { clienteId: '1', nombres: 'Cliente Test', direccion: '', telefono: '', contrasena: '', estado: true }
        ]);
        fixture.componentRef.setInput('isLoading', false);

        await fixture.whenStable();
    });

    it('debe iniciar con el formulario inválido y el saldo inicial habilitado', () => {
        expect(component.cuentaForm.invalid).toBeTruthy();
        expect(component.cuentaForm.controls.saldoInicial.enabled).toBeTruthy();
    });

    it('debe deshabilitar el saldo inicial cuando se está editando una cuenta existente', async () => {
        // Simulamos que el Smart Component nos pasa una cuenta para editar
        fixture.componentRef.setInput('cuentaEnEdicion', {
            cuentaId: '123',
            numeroCuenta: '99999',
            tipoCuenta: 'Ahorros',
            saldoInicial: 500,
            estado: true,
            clienteId: '1'
        });

        await fixture.whenStable();

        expect(component.cuentaForm.controls.saldoInicial.disabled).toBeTruthy();
        expect(component.cuentaForm.controls.numeroCuenta.value).toBe('99999');
    });

    it('debe emitir el evento "guardar" con todos los datos (incluyendo deshabilitados) si es válido', () => {
        const emitSpy = jest.spyOn(component.guardar, 'emit');

        // Llenamos el formulario con datos válidos
        component.cuentaForm.patchValue({
            numeroCuenta: '123456789',
            tipoCuenta: 'Corriente',
            saldoInicial: 1000,
            estado: true,
            clienteId: '1'
        });

        component.onSubmit();

        expect(emitSpy).toHaveBeenCalled();
        // Verificamos que se haya enviado con el valor correcto
        expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({
            numeroCuenta: '123456789',
            saldoInicial: 1000
        }));
    });

    it('NO debe emitir el evento "guardar" si el formulario es inválido', () => {
        const emitSpy = jest.spyOn(component.guardar, 'emit');

        // Dejamos el formulario vacío (inválido) y simulamos el envío
        component.onSubmit();

        expect(emitSpy).not.toHaveBeenCalled();
        // Verificamos que haya marcado los campos como tocados para mostrar los mensajes de error
        expect(component.cuentaForm.controls.numeroCuenta.touched).toBeTruthy();
    });
});