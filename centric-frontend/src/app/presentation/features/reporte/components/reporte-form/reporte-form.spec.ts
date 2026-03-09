import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ReporteForm } from './reporte-form';

describe('ReporteForm (Dumb Component)', () => {
    let component: ReporteForm;
    let fixture: ComponentFixture<ReporteForm>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReporteForm, ReactiveFormsModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(ReporteForm);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('listaClientes', [
            { clienteId: '1', nombres: 'Cliente Test', direccion: '', telefono: '', contrasena: '', estado: true }
        ]);
        fixture.componentRef.setInput('isLoading', false);
        await fixture.whenStable();
    });

    it('debe iniciar con el formulario inválido por defecto', () => {
        expect(component.filtroForm.invalid).toBeTruthy();
    });

    it('debe emitir el evento "generar" si el formulario es válido', () => {
        const emitSpy = jest.spyOn(component.generar, 'emit');

        component.filtroForm.patchValue({
            clienteId: '1',
            fechaInicio: '2026-01-01',
            fechaFin: '2026-01-31'
        });

        component.onSubmit();

        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith({
            clienteId: '1',
            fechaInicio: '2026-01-01',
            fechaFin: '2026-01-31'
        });
    });

    it('NO debe emitir "generar" si faltan fechas', () => {
        const emitSpy = jest.spyOn(component.generar, 'emit');

        component.filtroForm.patchValue({ clienteId: '1' });
        component.onSubmit();

        expect(emitSpy).not.toHaveBeenCalled();
        expect(component.filtroForm.controls.fechaInicio.invalid).toBeTruthy();
    });
});