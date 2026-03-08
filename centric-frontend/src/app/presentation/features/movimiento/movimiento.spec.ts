import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Movimiento } from './movimiento';

describe('Movimiento', () => {
  let component: Movimiento;
  let fixture: ComponentFixture<Movimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movimiento],
    }).compileComponents();

    fixture = TestBed.createComponent(Movimiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
