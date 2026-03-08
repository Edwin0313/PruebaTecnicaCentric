import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../infrastructure/services/cliente/cliente.service';
import { Clientes } from './cliente';

describe('Clientes (Smart Component)', () => {
  let component: Clientes;
  let fixture: ComponentFixture<Clientes>;
  let clienteServiceMock: any;

  const mockClientes: Cliente[] = [
    { clienteId: '1', nombres: 'Patricio', direccion: 'Quito', telefono: '123', contrasena: '', estado: true },
    { clienteId: '2', nombres: 'Edwin', direccion: 'Guayaquil', telefono: '456', contrasena: '', estado: true }
  ];

  beforeEach(async () => {
    clienteServiceMock = {
      getClientes: jest.fn().mockReturnValue(of(mockClientes)),
      createCliente: jest.fn(),
      updateCliente: jest.fn(),
      deleteCliente: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Clientes],
      providers: [
        { provide: ClienteService, useValue: clienteServiceMock },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Clientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe cargar clientes al iniciar y actualizar la señal listaClientes', () => {
    expect(component.listaClientes()).toEqual(mockClientes);
    expect(component.isLoading()).toBeFalsy();
  });

  it('debe filtrar clientes correctamente usando la señal computed (clientesFiltrados)', () => {
    // Simulamos escribir en el buscador
    component.terminoBusqueda.set('Patricio');

    // La señal computed se actualiza automáticamente
    expect(component.clientesFiltrados().length).toBe(1);
    expect(component.clientesFiltrados()[0].nombres).toBe('Patricio');
  });

  it('debe llamar a createCliente cuando no hay cliente en edición', () => {
    const nuevo = { nombres: 'Nuevo' };
    clienteServiceMock.createCliente.mockReturnValue(of({}));

    component.clienteEnEdicion.set(null);
    component.guardarCliente(nuevo as any);

    expect(clienteServiceMock.createCliente).toHaveBeenCalled();
  });

  it('debe manejar errores del servicio al cargar datos para cubrir la rama error', () => {
    clienteServiceMock.getClientes.mockReturnValue(throwError(() => new Error('Fail')));
    component.cargarClientes();
    expect(component.isLoading()).toBeFalsy();
  });
  // ... (dentro del describe de Clientes Smart Component)

  it('debe llamar a updateCliente cuando hay un cliente en edición', () => {
    clienteServiceMock.updateCliente.mockReturnValue(of({}));
    component.clienteEnEdicion.set({ clienteId: '1', nombres: 'Viejo' } as any);

    component.guardarCliente({ nombres: 'Nuevo' });

    expect(clienteServiceMock.updateCliente).toHaveBeenCalledWith('1', expect.anything());
  });

  it('debe eliminar un cliente tras confirmar la acción', () => {
    window.confirm = jest.fn().mockReturnValue(true);
    clienteServiceMock.deleteCliente.mockReturnValue(of({}));

    component.eliminarCliente('1');

    expect(clienteServiceMock.deleteCliente).toHaveBeenCalledWith('1');
  });

  it('debe cerrar el formulario al cancelar la edición', () => {
    component.mostrarFormulario.set(true);
    component.cancelarEdicion();
    expect(component.mostrarFormulario()).toBeFalsy();
    expect(component.clienteEnEdicion()).toBeNull();
  });
});