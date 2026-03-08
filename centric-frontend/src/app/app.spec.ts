import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { App } from './app'; // Asegúrate de que tu clase en app.ts se llame 'App'

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterModule.forRoot([])]
    }).compileComponents();
  });

  it('debe instanciar el componente principal correctamente', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});