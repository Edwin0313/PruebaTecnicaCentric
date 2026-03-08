import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../../../core/models/cliente.model';

export interface FiltroReporte {
    clienteId: string;
    fechaInicio: string;
    fechaFin: string;
}

@Component({
    selector: 'app-reporte-form',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: '../../reporte.css',
    template: `
    <div class="form-card">
        <form [formGroup]="filtroForm" (ngSubmit)="onSubmit()" novalidate>
            <div class="form-grid">
                <div class="form-group">
                    <label for="clienteId">Cliente <span class="required">*</span></label>
                    <select id="clienteId" formControlName="clienteId">
                        <option value="" disabled>Seleccione un cliente...</option>
                        @for (cliente of listaClientes(); track cliente.clienteId) {
                        <option [value]="cliente.clienteId">{{ cliente.nombres }}</option>
                        }
                    </select>
                    @if (filtroForm.controls.clienteId.invalid && filtroForm.controls.clienteId.touched) {
                    <span class="error-msg">Seleccione un cliente.</span>
                    }
                </div>

                <div class="form-group">
                    <label for="fechaInicio">Fecha Inicio <span class="required">*</span></label>
                    <input id="fechaInicio" type="date" formControlName="fechaInicio" />
                    @if (filtroForm.controls.fechaInicio.invalid && filtroForm.controls.fechaInicio.touched) {
                    <span class="error-msg">Fecha de inicio requerida.</span>
                    }
                </div>

                <div class="form-group">
                    <label for="fechaFin">Fecha Fin <span class="required">*</span></label>
                    <input id="fechaFin" type="date" formControlName="fechaFin" />
                    @if (filtroForm.controls.fechaFin.invalid && filtroForm.controls.fechaFin.touched) {
                    <span class="error-msg">Fecha de fin requerida.</span>
                    }
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="isLoading() || filtroForm.invalid">
                    {{ isLoading() ? 'Generando...' : 'Generar Reporte' }}
                </button>
            </div>
        </form>
    </div>
  `
})
export class ReporteForm {
    private readonly fb = inject(FormBuilder);

    listaClientes = input.required<Cliente[]>();
    isLoading = input<boolean>(false);

    generar = output<FiltroReporte>();

    filtroForm = this.fb.nonNullable.group({
        clienteId: ['', [Validators.required]],
        fechaInicio: ['', [Validators.required]],
        fechaFin: ['', [Validators.required]]
    });

    onSubmit(): void {
        if (this.filtroForm.valid) {
            this.generar.emit(this.filtroForm.getRawValue());
        } else {
            this.filtroForm.markAllAsTouched();
        }
    }
}