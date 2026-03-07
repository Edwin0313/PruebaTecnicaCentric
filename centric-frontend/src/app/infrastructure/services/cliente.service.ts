import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from '../../core/models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/clientes`;

    getClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.apiUrl);
    }

    getClienteById(id: string): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
    }

    createCliente(cliente: Omit<Cliente, 'clienteId'>): Observable<Cliente> {
        return this.http.post<Cliente>(this.apiUrl, cliente);
    }

    updateCliente(id: string, cliente: Partial<Cliente>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, cliente);
    }

    deleteCliente(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}