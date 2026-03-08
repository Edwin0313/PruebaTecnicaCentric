import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cuenta } from '../../../core/models/cuenta.model';

@Injectable({ providedIn: 'root' })
export class CuentaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/cuentas`;

    getCuentas(): Observable<Cuenta[]> {
        return this.http.get<Cuenta[]>(this.apiUrl);
    }

    createCuenta(cuenta: Cuenta): Observable<Cuenta> {
        return this.http.post<Cuenta>(this.apiUrl, cuenta);
    }

    updateCuenta(id: string, cuenta: Partial<Cuenta>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, cuenta);
    }

    deleteCuenta(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}