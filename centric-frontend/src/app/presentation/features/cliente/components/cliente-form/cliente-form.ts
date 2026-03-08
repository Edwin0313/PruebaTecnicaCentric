import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-card" role="region" aria-labelledby="form-title">
      <h3 id="form-title">{{ clienteEnEdicion() ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>

      <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()" novalidate>
        <div class="form-grid">
          <div class="form-group">
            <label for="nombres">Nombres completos <span class="required" aria-hidden="true">*</span></label>
            <input id="nombres" type="text" formControlName="nombres" />
            @if (clienteForm.controls.nombres.invalid && clienteForm.controls.nombres.touched) {
              <span class="error-msg" role="alert">El nombre es obligatorio (máx 100).</span>
            }
          </div>

          <div class="form-group">
            <label for="direccion">Dirección <span class="required" aria-hidden="true">*</span></label>
            <input id="direccion" type="text" formControlName="direccion" />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono <span class="required" aria-hidden="true">*</span></label>
            <input id="telefono" type="tel" formControlName="telefono" />
          </div>

          <div class="form-group">
            <label for="contrasena">Contraseña <span class="required" aria-hidden="true">*</span></label>
            <input id="contrasena" type="password" formControlName="contrasena" />
          </div>

          <div class="form-group checkbox-group">
            <label for="estado">
              <input id="estado" type="checkbox" formControlName="estado" /> Cliente Activo
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="cancelar.emit()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="clienteForm.invalid || isLoading()">
            Guardar
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: '../../cliente.css'
})
export class ClienteForm {
  private readonly fb = inject(FormBuilder);

  // Inputs
  clienteEnEdicion = input<Cliente | null>(null);
  isLoading = input<boolean>(false);

  // Outputs
  guardar = output<Partial<Cliente>>();
  cancelar = output<void>();

  clienteForm = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(200)]],
    telefono: ['', [Validators.required, Validators.maxLength(20)]],
    contrasena: ['', [Validators.required]],
    estado: [true]
  });

  constructor() {
    // Sincroniza el formulario reactivo con el Signal de entrada
    effect(() => {
      const cliente = this.clienteEnEdicion();
      if (cliente) {
        this.clienteForm.patchValue(cliente);
      } else {
        this.clienteForm.reset({ estado: true });
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.guardar.emit(this.clienteForm.getRawValue());
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }
}