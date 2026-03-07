import { Cliente } from './cliente.model';

export type TipoCuenta = 'Ahorro' | 'Corriente';

export interface Cuenta {
    cuentaId: string;
    numeroCuenta: string;
    tipoCuenta: TipoCuenta | string;
    saldoInicial: number;
    estado: boolean;
    clienteId: string;
    cliente?: Cliente;
}