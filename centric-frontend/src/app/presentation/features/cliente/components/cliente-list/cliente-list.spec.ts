import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Cliente } from '../../../../../core/models/cliente.model';
import { ClienteList } from './cliente-list';

describe('ClienteList (Dumb Component)', () => {
  let component: ClienteList;
  let fixture: ComponentFixture<ClienteList>;

  const mockClientes: Cliente[] = [
    { clienteId: '1', nombres: 'Patricio Villalobos', direccion: 'Quito', telefono: '0999999999', contrasena: '123', estado: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteList],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteList);
    component = fixture.componentInstance;

    // TDD: Simulamos el input() que vendrá del padre
    fixture.componentRef.setInput('clientes', mockClientes);
    await fixture.whenStable();
  });

  it('debe renderizar la tabla con los clientes recibidos por input', () => {
    const filas = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(filas.length).toBe(1);
    expect(filas[0].nativeElement.textContent).toContain('Patricio Villalobos');
  });

  it('debe emitir el evento "editar" con el cliente correcto al hacer clic en el botón', () => {
    // Espiamos el output
    const emitSpy = jest.spyOn(component.editar, 'emit');

    // Buscamos el botón y simulamos el clic
    const btnEditar = fixture.debugElement.query(By.css('.edit')).nativeElement;
    btnEditar.click();

    expect(emitSpy).toHaveBeenCalledWith(mockClientes[0]);
  });
});