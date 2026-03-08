import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { MovimientoService } from './movimiento.service';

describe('MovimientoService', () => {
    let service: MovimientoService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/movimiento`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovimientoService]
        });
        service = TestBed.inject(MovimientoService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debe registrar un nuevo movimiento (POST)', () => {
        const mockMov = { cuentaId: '1', tipoMovimiento: 'Depósito', valor: 100 };
        service.createMovimiento(mockMov as any).subscribe();

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('debe obtener el reporte con parámetros de consulta (GET)', () => {
        service.getReporte('2024-01-01', '2024-01-31', '123').subscribe();

        const req = httpMock.expectOne(r => r.url.includes('/reportes') && r.params.has('clienteId'));
        expect(req.request.params.get('fechaInicio')).toBe('2024-01-01');
        req.flush([]);
    });
});