import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
    let service: ClienteService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/cliente`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ClienteService]
        });
        service = TestBed.inject(ClienteService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('debe crear un cliente (POST)', () => {
        service.createCliente({ nombres: 'Nuevo' } as any).subscribe();
        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('debe actualizar un cliente (PUT)', () => {
        service.updateCliente('1', { nombres: 'Editado' } as any).subscribe();
        const req = httpMock.expectOne(`${apiUrl}/1`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('debe eliminar un cliente (DELETE)', () => {
        service.deleteCliente('1').subscribe();
        const req = httpMock.expectOne(`${apiUrl}/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });
});