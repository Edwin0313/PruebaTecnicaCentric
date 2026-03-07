import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movimiento } from '../../core/models/movimiento.model';
import { ReporteMovimiento } from '../../core/models/reporte.model';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/movimientos`;
    private readonly reportesUrl = `${environment.apiUrl}/reportes`;

    getMovimientos(): Observable<Movimiento[]> {
        return this.http.get<Movimiento[]>(this.apiUrl);
    }

    createMovimiento(movimiento: Movimiento): Observable<Movimiento> {
        return this.http.post<Movimiento>(this.apiUrl, movimiento);
    }

    getReporte(fechaInicio: string, fechaFin: string, clienteId: string): Observable<ReporteMovimiento[]> {
        const params = new HttpParams()
            .set('fechaInicio', fechaInicio)
            .set('fechaFin', fechaFin)
            .set('clienteId', clienteId);

        return this.http.get<ReporteMovimiento[]>(this.reportesUrl, { params });
    }
}