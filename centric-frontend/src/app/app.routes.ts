import { Routes } from '@angular/router';
import { MainLayout } from './presentation/layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', redirectTo: 'clientes', pathMatch: 'full' },
            {
                path: 'clientes',
                loadComponent: () => import('./presentation/features/cliente/cliente').then(c => c.Clientes)
            },
            {
                path: 'cuentas',
                loadComponent: () => import('./presentation/features/cuenta/cuenta').then(c => c.Cuentas)
            },
            {
                path: 'movimientos',
                loadComponent: () => import('./presentation/features/movimiento/movimiento').then(c => c.Movimientos)
            },
            {
                path: 'reportes',
                loadComponent: () => import('./presentation/features/reporte/reporte').then(c => c.Reportes)
            }
        ]
    },
    { path: '**', redirectTo: 'clientes' }
];