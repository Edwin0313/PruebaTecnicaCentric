import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cuenta } from '../../../../../core/models/cuenta.model';

@Component({
    selector: 'app-movimiento-form',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: '../../movimiento.css',
    template: `
    <div class="form-card">
        <h3>Registrar Transacción</h3>

        <form [formGroup]="movimientoForm" (ngSubmit)="onSubmit()" novalidate>
            <div class="form-grid">

                <div class="form-group">
                    <label for="cuentaId">Cuenta Afectada <span class="required">*</span></label>
                    <select id="cuentaId" formControlName="cuentaId">
                        <option value="" disabled>Seleccione una cuenta...</option>
                        @for (cuenta of listaCuentas(); track cuenta.cuentaId) {
                        <option [value]="cuenta.cuentaId">{{ cuenta.numeroCuenta }} - {{ cuenta.tipoCuenta }}</option>
                        }
                    </select>
                    @if (movimientoForm.controls.cuentaId.invalid && movimientoForm.controls.cuentaId.touched) {
                    <span class="error-msg">Debe seleccionar una cuenta.</span>
                    }
                </div>

                <div class="form-group">
                    <label for="tipoMovimiento">Tipo de Movimiento <span class="required">*</span></label>
                    <select id="tipoMovimiento" formControlName="tipoMovimiento">
                        <option value="Depósito">Depósito (+)</option>
                        <option value="Retiro">Retiro (-)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="valor">Monto ($) <span class="required">*</span></label>
                    <input id="valor" type="number" step="0.01" formControlName="valor" />
                    @if (movimientoForm.controls.valor.invalid && movimientoForm.controls.valor.touched) {
                    <span class="error-msg">El monto debe ser mayor a cero.</span>
                    }
                </div>

            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="onCancelar()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="movimientoForm.invalid || isLoading()">Registrar</button>
            </div>
        </form>
    </div>
  `
})
export class MovimientoForm {
    private readonly fb = inject(FormBuilder);

    listaCuentas = input.required<Cuenta[]>();
    isLoading = input<boolean>(false);

    // Usamos 'any' u object para el payload crudo del formulario
    guardar = output<{ cuentaId: string, tipoMovimiento: string, valor: number }>();
    cancelar = output<void>();

    movimientoForm = this.fb.nonNullable.group({
        cuentaId: ['', [Validators.required]],
        tipoMovimiento: ['Depósito', [Validators.required]],
        valor: [0, [Validators.required, Validators.min(0.01)]]
    });

    onSubmit(): void {
        if (this.movimientoForm.valid) {
            this.guardar.emit(this.movimientoForm.getRawValue());
        } else {
            this.movimientoForm.markAllAsTouched();
        }
    }

    onCancelar(): void {
        this.movimientoForm.reset({ tipoMovimiento: 'Depósito', valor: 0, cuentaId: '' });
        this.cancelar.emit();
    }
}