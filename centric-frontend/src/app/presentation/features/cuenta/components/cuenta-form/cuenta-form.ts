import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../../../core/models/cliente.model';
import { Cuenta } from '../../../../../core/models/cuenta.model';

@Component({
    selector: 'app-cuenta-form',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: '../../cuenta.css',
    template: `
    <div class="form-card">
        <h3>{{ cuentaEnEdicion() ? 'Editar Cuenta' : 'Nueva Cuenta' }}</h3>

        <form [formGroup]="cuentaForm" (ngSubmit)="onSubmit()" novalidate>
            <div class="form-grid">

                <div class="form-group">
                    <label for="clienteId">Cliente Propietario <span class="required">*</span></label>
                    <select id="clienteId" formControlName="clienteId">
                        <option value="" disabled>Seleccione un cliente...</option>
                        @for (cliente of listaClientes(); track cliente.clienteId) {
                            <option [value]="cliente.clienteId">{{ cliente.nombres }}</option>
                        }
                    </select>
                    @if (cuentaForm.controls.clienteId.invalid && cuentaForm.controls.clienteId.touched) {
                    <span class="error-msg">Debe seleccionar un cliente.</span>
                    }
                </div>

                <div class="form-group">
                    <label for="numeroCuenta">Número de Cuenta <span class="required">*</span></label>
                    <input id="numeroCuenta" type="text" formControlName="numeroCuenta" />
                    @if (cuentaForm.controls.numeroCuenta.invalid && cuentaForm.controls.numeroCuenta.touched) {
                    <span class="error-msg">El número es obligatorio.</span>
                    }
                </div>

                <div class="form-group">
                    <label for="tipoCuenta">Tipo de Cuenta <span class="required">*</span></label>
                    <select id="tipoCuenta" formControlName="tipoCuenta">
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="saldoInicial">Saldo Inicial ($) <span class="required">*</span></label>
                    <input id="saldoInicial" type="number" step="0.01" formControlName="saldoInicial" />
                    @if (cuentaForm.controls.saldoInicial.invalid && cuentaForm.controls.saldoInicial.touched) {
                    <span class="error-msg">El saldo inicial debe ser 0 o mayor.</span>
                    }
                </div>

                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" formControlName="estado" /> Cuenta Activa
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="cancelar.emit()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="cuentaForm.invalid || isLoading()">
                    Guardar
                </button>
            </div>
        </form>
    </div>
  `
})
export class CuentaForm {
    private readonly fb = inject(FormBuilder);

    cuentaEnEdicion = input<Cuenta | null>(null);
    listaClientes = input.required<Cliente[]>();
    isLoading = input<boolean>(false);

    guardar = output<Partial<Cuenta>>();
    cancelar = output<void>();

    cuentaForm = this.fb.nonNullable.group({
        numeroCuenta: ['', [Validators.required, Validators.maxLength(20)]],
        tipoCuenta: ['Ahorros', [Validators.required]],
        saldoInicial: [0, [Validators.required, Validators.min(0)]],
        estado: [true],
        clienteId: ['', [Validators.required]]
    });

    constructor() {
        effect(() => {
            const cuenta = this.cuentaEnEdicion();
            if (cuenta) {
                this.cuentaForm.patchValue(cuenta);
                this.cuentaForm.controls.saldoInicial.disable(); // Regla de negocio: No editar saldo
            } else {
                this.cuentaForm.reset({ tipoCuenta: 'Ahorros', saldoInicial: 0, estado: true, clienteId: '' });
                this.cuentaForm.controls.saldoInicial.enable();
            }
        });
    }

    onSubmit(): void {
        if (this.cuentaForm.valid) {
            // getRawValue() incluye el saldoInicial aunque esté deshabilitado
            this.guardar.emit(this.cuentaForm.getRawValue());
        } else {
            this.cuentaForm.markAllAsTouched();
        }
    }
}