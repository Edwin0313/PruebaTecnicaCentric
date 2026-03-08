import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ClienteForm } from './cliente-form';

describe('ClienteForm (Dumb Component)', () => {
  let component: ClienteForm;
  let fixture: ComponentFixture<ClienteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteForm, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteForm);
    component = fixture.componentInstance;

    // Inicializamos los inputs vacíos por defecto
    fixture.componentRef.setInput('clienteEnEdicion', null);
    fixture.componentRef.setInput('isLoading', false);
    await fixture.whenStable();
  });

  it('debe iniciar con el formulario inválido', () => {
    expect(component.clienteForm.invalid).toBeTruthy();
  });

  it('debe emitir el evento "guardar" si el formulario es válido al hacer submit', () => {
    const emitSpy = jest.spyOn(component.guardar, 'emit');

    // Llenamos el formulario para que sea válido
    component.clienteForm.patchValue({
      nombres: 'Prueba TDD',
      direccion: 'Av Siempre Viva',
      telefono: '1234567',
      contrasena: 'secreta',
      estado: true
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ nombres: 'Prueba TDD' }));
  });

  it('NO debe emitir el evento "guardar" si el formulario es inválido', () => {
    const emitSpy = jest.spyOn(component.guardar, 'emit');

    // Intentamos enviar el formulario vacío
    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
    // Validamos que marcó los campos en rojo (touched)
    expect(component.clienteForm.controls.nombres.touched).toBeTruthy();
  });
});