IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Clientes] (
    [ClienteId] uniqueidentifier NOT NULL,
    [Nombres] nvarchar(100) NOT NULL,
    [Direccion] nvarchar(200) NOT NULL,
    [Telefono] nvarchar(20) NOT NULL,
    [Contrasena] nvarchar(max) NOT NULL,
    [Estado] bit NOT NULL,
    CONSTRAINT [PK_Clientes] PRIMARY KEY ([ClienteId])
);

CREATE TABLE [Cuentas] (
    [CuentaId] uniqueidentifier NOT NULL,
    [NumeroCuenta] nvarchar(20) NOT NULL,
    [TipoCuenta] nvarchar(20) NOT NULL,
    [SaldoInicial] decimal(18,2) NOT NULL,
    [Estado] bit NOT NULL,
    [ClienteId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Cuentas] PRIMARY KEY ([CuentaId]),
    CONSTRAINT [FK_Cuentas_Clientes_ClienteId] FOREIGN KEY ([ClienteId]) REFERENCES [Clientes] ([ClienteId]) ON DELETE CASCADE
);

CREATE TABLE [Movimientos] (
    [MovimientoId] uniqueidentifier NOT NULL,
    [Fecha] datetime2 NOT NULL,
    [TipoMovimiento] nvarchar(50) NOT NULL,
    [Valor] decimal(18,2) NOT NULL,
    [Saldo] decimal(18,2) NOT NULL,
    [CuentaId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_Movimientos] PRIMARY KEY ([MovimientoId]),
    CONSTRAINT [FK_Movimientos_Cuentas_CuentaId] FOREIGN KEY ([CuentaId]) REFERENCES [Cuentas] ([CuentaId]) ON DELETE NO ACTION
);

CREATE INDEX [IX_Cuentas_ClienteId] ON [Cuentas] ([ClienteId]);

CREATE INDEX [IX_Movimientos_CuentaId] ON [Movimientos] ([CuentaId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260306225704_InitialCreate', N'10.0.3');

COMMIT;
GO

