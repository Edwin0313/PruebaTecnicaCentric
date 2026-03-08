import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { CuentaService } from './cuenta.service';

describe('CuentaService', () => {
    let service: CuentaService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/cuenta`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CuentaService]
        });
        service = TestBed.inject(CuentaService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('debe actualizar una cuenta (PUT)', () => {
        service.updateCuenta('1', { numeroCuenta: '999' } as any).subscribe();
        const req = httpMock.expectOne(`${apiUrl}/1`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('debe eliminar una cuenta (DELETE)', () => {
        service.deleteCuenta('1').subscribe();
        const req = httpMock.expectOne(`${apiUrl}/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });
});