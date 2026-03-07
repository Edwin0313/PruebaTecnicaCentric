export interface ReporteMovimiento {
    fecha: string;
    cliente: string;
    numeroCuenta: string;
    tipo: string;
    saldoInicial: number;
    estado: boolean;
    movimiento: number;
    saldoDisponible: number;
}