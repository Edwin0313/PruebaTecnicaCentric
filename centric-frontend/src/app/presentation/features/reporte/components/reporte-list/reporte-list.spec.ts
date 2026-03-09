import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReporteList } from './reporte-list';

describe('ReporteList (Dumb Component)', () => {
    let component: ReporteList;
    let fixture: ComponentFixture<ReporteList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReporteList],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(ReporteList);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('listaReporte', [
            { fecha: new Date('2026-03-08'), cliente: 'Juan', numeroCuenta: '123', tipo: 'Ahorros', saldoInicial: 100, estado: true, movimiento: 50, saldoDisponible: 150 }
        ]);
        fixture.componentRef.setInput('busquedaRealizada', true);
        await fixture.whenStable();
    });

    it('debe renderizar la tabla con los datos y pipes de moneda correctos', () => {
        const filas = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(filas.length).toBe(1);
        const contenidoFila = filas[0].nativeElement.textContent;
        expect(contenidoFila).toContain('$100.00');
        expect(contenidoFila).toContain('Juan');
    });

    it('debe emitir el evento "exportarPdf" al hacer clic en el botón', () => {
        const emitSpy = jest.spyOn(component.exportarPdf, 'emit');
        const btnExportar = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
        btnExportar.click();
        expect(emitSpy).toHaveBeenCalled();
    });
});