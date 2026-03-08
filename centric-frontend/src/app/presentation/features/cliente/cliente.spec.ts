import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { jest } from '@jest/globals';
import { of } from 'rxjs';
import { ClienteService } from '../../../infrastructure/services/cliente.service';
import { Clientes } from './cliente';

describe('Pruebas del Componente Clientes', () => {
  let component: Clientes;
  let fixture: ComponentFixture<Clientes>;
  let mockClienteService: any;

  beforeEach(async () => {
    // 1. Mockeamos el servicio de infraestructura
    mockClienteService = {
      getClientes: jest.fn().mockReturnValue(of([])),
      createCliente: jest.fn().mockReturnValue(of({ clienteId: '123', nombres: 'Test' }))
    };

    // 2. Configuramos el entorno de pruebas
    await TestBed.configureTestingModule({
      imports: [Clientes, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(), // Respetamos tu arquitectura Zoneless
        { provide: ClienteService, useValue: mockClienteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Clientes);
    component = fixture.componentInstance;

    // Forzamos la resolución de promesas y señales
    await fixture.whenStable();
  });

  it('debe instanciar el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con el formulario oculto y mostrarlo al hacer clic en "Nuevo"', () => {
    expect(component.mostrarFormulario()).toBeFalsy();

    component.abrirFormulario();

    expect(component.mostrarFormulario()).toBeTruthy();
    expect(component.clienteEnEdicion()).toBeNull();
  });

  it('el formulario debe ser inválido si los campos obligatorios están vacíos', () => {
    component.abrirFormulario();
    // El formulario arranca con campos vacíos
    expect(component.clienteForm.invalid).toBeTruthy();

    // Llenamos un campo
    component.clienteForm.controls.nombres.setValue('Patricio Villalobos');
    // Sigue siendo inválido porque faltan los demás
    expect(component.clienteForm.invalid).toBeTruthy();
  });

  it('debe llamar a cargarClientes al inicializarse (ngOnInit)', () => {
    component.ngOnInit();
    expect(mockClienteService.getClientes).toHaveBeenCalled();
  });
});