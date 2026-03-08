import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule],
  template: `
    <div class="layout-container">
      <aside class="sidebar" [class.collapsed]="!isSidebarOpen()">
        <div class="logo">
          <h2 [class.visually-hidden]="!isSidebarOpen()">Centric</h2>
          <button (click)="toggleSidebar()" aria-label="Alternar menú lateral" class="toggle-btn" title="Alternar menú">
            ☰
          </button>
        </div>
        <nav aria-label="Menú principal">
          <ul>
            <li><a routerLink="/clientes" routerLinkActive="active">Clientes</a></li>
            <li><a routerLink="/cuentas" routerLinkActive="active">Cuentas</a></li>
            <li><a routerLink="/movimientos" routerLinkActive="active">Movimientos</a></li>
            <li><a routerLink="/reportes" routerLinkActive="active">Reportes</a></li>
          </ul>
        </nav>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <h1>Panel de Control</h1>
          <div class="user-info">Administrador</div>
        </header>
        
        <section class="content-area">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: `
    .layout-container { display: flex; min-height: 100vh; background-color: var(--bg-color); }
    
    .sidebar { 
      width: 250px; 
      background-color: var(--surface-color); 
      border-right: 1px solid #ddd; 
      transition: width 0.3s ease; 
      display: flex;
      flex-direction: column;
    }
    .sidebar.collapsed { width: 70px; }
    .sidebar.collapsed a { text-indent: -9999px; white-space: nowrap; overflow: hidden; padding-left: 0; text-align: center; }
    .sidebar.collapsed a::after { content: '•'; text-indent: 0; display: block; margin-top: -1.2rem;}

    .logo { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #ddd; height: 60px; box-sizing: border-box;}
    .toggle-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary); }
    
    nav ul { list-style: none; padding: 0; margin: 0; }
    nav li a { display: block; padding: 1rem; color: var(--text-primary); text-decoration: none; border-left: 4px solid transparent; transition: all 0.2s; font-weight: 500; }
    nav li a:hover, nav li a.active { background-color: var(--bg-color); color: var(--primary-color); border-left: 4px solid var(--primary-color); }
    
    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar { background-color: var(--surface-color); padding: 0 2rem; height: 60px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; }
    .topbar h1 { font-size: 1.2rem; margin: 0; color: var(--text-primary); }
    
    .content-area { padding: 2rem; flex: 1; overflow-y: auto; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout {
  // Estado local manejado con Signals
  isSidebarOpen = signal<boolean>(true);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}