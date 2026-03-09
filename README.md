# Centric - Sistema de Gestión

Prueba técnica desarrollada con una arquitectura enfocada en **Mantenibilidad**, **Escalabilidad** y **Calidad de Software**.

## Arquitectura y Patrones

Este proyecto utiliza una separación clara de responsabilidades:

- **Frontend (Angular 18):**
  - **Patrón Smart & Dumb Components:** Separación de la lógica de estado (Smart) de la lógica de presentación (Dumb).
  - **Signals & Computed:** Gestión reactiva del estado sin sobrecargar el ciclo de detección de cambios.
  - **TDD (Test Driven Development):** Cobertura de pruebas superior al **86%**, validando lógica de negocio y manejo de errores.
  - **Styles:** Sistema de diseño centralizado con variables CSS y tematización corporativa.

- **Dockerized:** Orquestación completa con SQL Server.

## Cómo ejecutar el proyecto

Gracias a la dockerización, puedes levantar todo el ecosistema (DB, API y Web) con un solo comando:

```bash
docker-compose up --build
```
