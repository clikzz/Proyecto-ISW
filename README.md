# Proyecto-ISW
## Sección 1  |  Ingeniería Civil Informática
**Integrantes:** Anaís Saldías, Aracelli Rivas, Alejandro Yañez, Álvaro Loyola

## Tabla de contenidos
* [Descripción General](#descripción-general)
* [Backend](#backend)
* [Frontend](#frontend)
* [Arquitectura del Proyecto](#arquitectura-del-proyecto)
  * [Estructura del Backend](#estructura-del-backend)
  * [Estructura del Frontend](#estructura-del-frontend)
* [Instalación y Configuración](#instalación-y-configuración)
  * [Prerrequisitos](#prerrequisitos)
  * [Clonación del Repositorio](#clonación-del-repositorio)
  * [Configuración del Backend](#configuración-del-backend)
  * [Configuración del Frontend](#configuración-del-frontend)
  * [Configuración de DBeaver y PostgreSQL](#configuración-de-dbeaver-y-postgresql)
* [Tecnologías](#tecnologías)
  * [PostgreSQL](#postgresql)
  * [Express.js](#expressjs)
  * [React](#react)
  * [Node.js](#nodejs)
  * [Next.js](#nextjs)
  * [Otros Recursos y Librerías](#otros-recursos-y-librerías)

## Descripción General

Este proyecto utiliza el stack **PERN** (PostgreSQL, Express.js, React y Node.js) y adicionalmente **Next.js**

### Backend

El Backend de esta estructura implementa las siguientes funcionalidades principales:

**Autenticación y Autorización**
* Uso de middleware `auth.middleware.js` y `authorization.middleware.js` para manejar la autenticación y autorización segura de usuarios.
* Implementación de login y register mediante los controladores `auth.controller.js` y servicios como `auth.service.js.`
* Validación de datos de autenticación con `login.validation.js` y `register.validation.js.`

**Gestión de Usuarios y Perfiles**
* CRUD de usuarios: Los controladores `user.controller.js` y `profile.controller.js` permiten gestionar usuarios y perfiles.
* Validación de datos de perfil utilizando `profile.validation.js.`
* Middleware como `profileValidation.middleware.js` asegura la integridad de los datos ingresados.

**Inventario y Artículos**
* CRUD de inventario y artículos mediante los controladores `inventory.controller.js` e `item.controller.js.`
* Servicios asociados como `inventory.service.js` e `item.service.js` para lógica de negocio.
* Validación de datos con `inventory.validation.js` y `item.validation.js.`

**Proveedores y Relación Artículo-Proveedor**
* Manejo de proveedores y asociación entre artículos y proveedores mediante los controladores `supplier.controller.js` e `itemSupplier.controller.js.`
* Validación de información con `supplier.validation.js.`

**Gestión de Servicios**
CRUD de servicios con el controlador `service.controller.js.`
Validaciones de servicios usando `service.validation.js` y `middleware service.middleware.js.`

**Transacciones y Servicios Asociados**
* Gestión de transacciones y servicios asociados con los controladores `transaction.controller.js` y `transactionService.controller.js.`
* Servicios como `transaction.service.js` y validaciones en `transaction.validation.js`.

**Tareas y Empleados**
* Control de tareas y empleados utilizando los controladores `task.controller.js` y `employees.controller.js`.
* Validaciones específicas con `employee.validation.js`.

**Servicios de Correo Electrónico**
Uso del servicio `email.service.js` para envío de correos electrónicos automatizados, por ejemplo, para confirmaciones o notificaciones.

**Gestión de la Base de Datos**
* Conexión a la base de datos configurada en `db.js`.

**Carga de Archivos con Cloudinary**
* Configuración de Cloudinary en `cloudinary.js` para almacenar y gestionar imágenes.

**Validaciones Generales**
* Validación del RUT chileno utilizando el helper `validateRut.js`.


### Frontend

El Frontend proporciona una interfaz de usuario funcional y organizada para interactuar con el sistema. Incluye las siguientes páginas y funcionalidades principales:

### **Autenticación**
- **Página de Inicio de Sesión**: Permite a los usuarios autenticarse en el sistema.
  - Archivo: `pages/login.jsx`
- **Página de Recuperación de Contraseña**: Permite a los usuarios solicitar una recuperación de contraseña.
  - Archivo: `pages/forgot-password.jsx`
- **Página de Restablecimiento de Contraseña**: Facilita el cambio de contraseña mediante un enlace seguro.
  - Archivo: `pages/reset-password.jsx`
- **Componentes auxiliares**:
  - `LoginForm.jsx`, `Notification.jsx`, `SecurityForm.jsx`

### **Página Principal (Dashboard)**
- Página de inicio que presenta estadísticas generales y la actividad reciente del sistema.
  - Archivo: `pages/home.jsx`
- **Componentes destacados**:
  - `Statistics.jsx`: Muestra métricas importantes.
  - `RecentActivity.jsx`: Registro de las últimas acciones en el sistema.
  - `TopSellingProducts.jsx`: Visualización de los productos más vendidos.

### **Gestión de Usuarios**
- **Página de Usuarios**: Permite la administración completa de usuarios registrados.
  - Archivo: `pages/users.jsx`
- **Funcionalidades**:
  - Tabla interactiva con búsqueda y filtros (`UsersTable.jsx`).
  - Creación de nuevos usuarios mediante un formulario modal (`AddUserDialog.jsx`).


### **Inventario**
- **Página de Inventario**: Permite la gestión de productos y stock.
  - Archivo: `pages/inventory.jsx`
- **Funcionalidades**:
  - Tabla de inventario interactiva (`InventoryTable.jsx`).
  - Agregar, editar y eliminar productos mediante diálogos modales:
    - `AddItemDialog.jsx`, `EditItemDialog.jsx`.
  - Exportar datos con botones específicos (`ExportButtons.jsx`).

### **Gestión de Proveedores**
- **Página de Proveedores**: Facilita la administración de proveedores.
  - Archivo: `pages/suppliers.jsx`
- **Funcionalidades**:
  - Tabla de proveedores (`SupplierTable.jsx`).
  - Agregar y modificar proveedores:
    - `AddSupplierDialog.jsx`, `ModifySupplierDialog.jsx`.
  - Exportar datos (`ExportButtons.jsx`).

### **Transacciones Financieras**
- **Página de Finanzas**: Administra transacciones y resumen de balances.
  - Archivo: `pages/finance.jsx`
- **Funcionalidades**:
  - Visualización de todas las transacciones (`AllTransactions.jsx`).
  - Balance general con tarjetas (`BalanceCards.jsx`).
  - Resumen y análisis mediante gráficos interactivos (`Charts.jsx`).
  - Creación y modificación de transacciones:
    - `NewTransactionDialog.jsx`, `ModifyTransactionDialog.jsx`.

### **Gestión de Servicios**
- **Página de Servicios**: Administra los servicios ofrecidos.
  - Archivo: `pages/services.jsx`
- **Funcionalidades**:
  - Tabla de servicios (`ServicesTable.jsx`).
  - Editar y visualizar detalles de servicios:
    - `EditServiceDialog.jsx`, `ServiceDetailsDialog.jsx`.

### **Gestión de Tareas**
- **Página de Tareas**: Administra las tareas del sistema mediante un tablero estilo Kanban.
  - Archivo: `pages/tasks.jsx`
- **Funcionalidades**:
  - Tablero principal (`TaskBoard.jsx`).
  - Columnas y tarjetas interactivas para organizar tareas (`TaskColumn.jsx`, `TaskCard.jsx`).
  - Visualización de detalles de una tarea (`TaskDetailsDialog.jsx`)

### **Perfil de Usuario**
- **Página de Perfil**: Permite a los usuarios gestionar su información personal.
  - Archivo: `pages/profile.jsx`
- **Funcionalidades**:
  - Formularios para editar datos personales (`PersonalDataForm.jsx`).
  - Cambio de imagen de perfil (`ProfilePicture.jsx`).

### **Componentes de UI Reutilizables**
- **Componentes Generales**:
  - Botones (`button.jsx`), tablas (`table.jsx`), diálogos (`dialog.jsx`), inputs (`input.jsx`) y otros elementos reutilizables.
- **Temas y Personalización**: Cambio de tema interactivo con `ThemeToggle.jsx`.

### **Validación y Helpers**
- **Validaciones**:
  - Archivos en `src/validations/` aseguran la integridad de datos para acciones como nuevos productos, transacciones o servicios.
- **Helpers**:
  - Funciones útiles para exportar datos (`exportInventory.js`, `exportTransactions.js`) y manipular fechas o textos.

### **Contexto Global**
- Manejo del estado global de alertas y autenticación.
  - Archivos: `alertContext.js`, `authContext.js`.

### **Estilos**
- **CSS Global**: Configuración base y estilos generales en `globals.css`.
- **Tailwind CSS**: Configuración adicional en `tailwind.config.js` para diseño moderno y responsivo.


## Arquitectura del Proyecto

Este proyecto está dividido en dos partes principales: el Backend y el Frontend. A continuación, se muestra la estructura del Backend:

### Estructura del Backend

```bash
backend/
│
├── node_modules/
├── src/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── employees.controller.js
│   │   ├── inventory.controller.js
│   │   ├── item.controller.js
│   │   ├── itemSupplier.controller.js
│   │   ├── profile.controller.js
│   │   ├── service.controller.js
│   │   ├── supplier.controller.js
│   │   ├── task.controller.js
│   │   ├── transaction.controller.js
│   │   ├── transactionService.controller.js
│   │   └── user.controller.js
│   │
│   ├── helpers/
│   │   └── validateRut.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── authorization.middleware.js
│   │   ├── authValidation.middleware.js
│   │   ├── employees.middleware.js
│   │   ├── inventory.middleware.js
│   │   ├── item.middleware.js
│   │   ├── profileValidation.middleware.js
│   │   ├── service.middleware.js
│   │   ├── supplier.middleware.js
│   │   ├── transaction.middleware.js
│   │   └── user.middleware.js
│   │
│   ├── models/
│   │   ├── Inventory.js
│   │   ├── Item.js
│   │   ├── ItemSupplier.js
│   │   ├── Service.js
│   │   ├── Supplier.js
│   │   ├── Transaction.js
│   │   ├── TransactionService.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── inventory.routes.js
│   │   ├── item.routes.js
│   │   ├── itemSupplier.routes.js
│   │   ├── profile.routes.js
│   │   ├── service.routes.js
│   │   ├── supplier.routes.js
│   │   ├── task.routes.js
│   │   ├── transaction.routes.js
│   │   ├── transactionService.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── employee.service.js
│   │   ├── inventory.service.js
│   │   ├── item.service.js
│   │   ├── itemSupplier.service.js
│   │   ├── profile.service.js
│   │   ├── service.service.js
│   │   ├── supplier.service.js
│   │   ├── task.service.js
│   │   ├── transaction.service.js
│   │   └── user.service.js
│   │
│   ├── validations/
│   │   ├── employee.validation.js
│   │   ├── inventory.validation.js
│   │   ├── item.validation.js
│   │   ├── login.validation.js
│   │   ├── profile.validation.js
│   │   ├── register.validation.js
│   │   ├── service.validation.js
│   │   ├── supplier.validation.js
│   │   ├── transaction.validation.js
│   │   └── user.validation.js
│   │
│   ├── app.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
```

### Estructura del Frontend

```bash
frontend/
│
├── .next/
├── dist/
├── node_modules/
├── public/
│
├── src/
│   │
│   ├── api/
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   ├── profile.js
│   │   ├── service.js
│   │   ├── suppliers.js
│   │   ├── task.js
│   │   ├── transaction.js
│   │   ├── transactionService.js
│   │   └── user.js
│   │
│   ├── components/
│   │   ├── finance/
│   │   │   ├── dialog/
│   │   │   │   ├── ModifyTransactionDialog.jsx
│   │   │   │   └── NewTransactionDialog.jsx
│   │   │   ├── AllTransactions.jsx
│   │   │   ├── BalanceCards.jsx
│   │   │   ├── Charts.jsx
│   │   │   └── TransactionSummary.jsx
│   │   │
│   │   ├── home/
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── Statistics.jsx
│   │   │   └── TopSellingProducts.jsx
│   │   │
│   │   ├── inventory/
│   │   │   ├── dialog/
│   │   │   │   ├── AddItemDialog.jsx
│   │   │   │   ├── AddPurchaseDialog.jsx
│   │   │   │   ├── EditItemDialog.jsx
│   │   │   │   ├── EditPurchaseDialog.jsx
│   │   │   │   ├── EditSaleDialog.jsx
│   │   │   │   ├── ExistingPurchaseForm.jsx
│   │   │   │   ├── ItemDetailsDialog.jsx
│   │   │   │   ├── NewPurchaseForm.jsx
│   │   │   │   ├── PurchaseDetailsDialog.jsx
│   │   │   │   ├── SaleDetailsDialog.jsx
│   │   │   │   ├── SellItemDialog.jsx
│   │   │   └── ExportButtons.jsx
│   │   │   ├── InventoryTable.jsx
│   │   │   ├── PurchasesTable.jsx
│   │   │   └── SalesTable.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── PrivateLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── dialog/
│   │   │   │   ├── EditServiceDialog.jsx
│   │   │   │   ├── ServiceDetailsDialog.jsx
│   │   │   │   └── ServicesDialog.jsx
│   │   │   ├── ServicesTable.jsx
│   │   │   └── ExportButtons.jsx
│   │   │
│   │   ├── suppliers/
│   │   │   ├── AddSupplierDialog.jsx
│   │   │   ├── ModifySupplierDialog.jsx
│   │   │   ├── ExportButtons.jsx
│   │   │   └── SupplierTable.jsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── TaskBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskColumn.jsx
│   │   │   └── TaskDetailsDialog.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── avatar.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── carousel.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── ImageCropper.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── phone-input.jsx
│   │   │   ├── select.jsx
│   │   │   ├── skeleton.jsx
│   │   │   ├── table.jsx
│   │   │   └── textarea.jsx
│   │   │
│   │   └── users/
│   │       ├── AddUserDialog.jsx
│   │       └── UsersTable.jsx
│   │
│   │   ├── ConfirmationDialog.jsx
│   │   ├── LoginForm.jsx
│   │   ├── Notification.jsx
│   │   ├── PersonalDataForm.jsx
│   │   ├── ProfilePicture.jsx
│   │   ├── SecurityForm.jsx
│   │   ├── TabNavigation.jsx
│   │   ├── ThemeToggle.jsx
│   │
│   ├── context/
│   │   ├── alertContext.js
│   │   └── authContext.js
│   │
│   ├── helpers/
│   │   ├── capitalize.js
│   │   ├── dates.js
│   │   ├── exportInventory.js
│   │   ├── exportPurchases.js
│   │   ├── exportSales.js
│   │   ├── exportSuppliers.js
│   │   ├── exportTransactions.js
│   │   └── exportServices.js
│   │
│   ├── hooks/
│   │   └── useAuthRedirect.js
│   │
│   ├── lib/
│   │   └── utils.js
│   │
│   ├── pages/
│   │   ├── _app.jsx
│   │   ├── finance.jsx
│   │   ├── forgot-password.jsx
│   │   ├── home.jsx
│   │   ├── index.jsx
│   │   ├── inventory.jsx
│   │   ├── login.jsx
│   │   ├── profile.jsx
│   │   ├── reset-password.jsx
│   │   ├── services.jsx
│   │   ├── suppliers.jsx
│   │   ├── tasks.jsx
│   │   └── users.jsx
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── validations/
│   │   ├── modifyItem.js
│   │   ├── modifyPurchase.js
│   │   ├── modifySale.js
│   │   ├── modifySupplier.js
│   │   ├── modifyTransaction.js
│   │   ├── newItem.js
│   │   ├── newPurchase.js
│   │   ├── newSale.js
│   │   ├── newService.js
│   │   ├── newSupplier.js
│   │   ├── newTransaction.js
│   │   └── newUser.js
│   │
│   ├── favicon.ico
├── .env
├── .eslintrc.json
├── .gitignore
├── components.json
├── ecosystem.json
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tailwind.config.js
```

## Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (versión 20.X.X LTS) como entorno de ejecución de JavaScript.
- [Git](https://git-scm.com/) (versión 2.45.2 o superior) para clonar el repositorio.
- [PostgreSQL](https://www.postgresql.org/) (versión 16.X.X) para la base de datos.

## Tecnologías

Este proyecto utiliza el stack **PERN**, que incluye las siguientes tecnologías:

### PostgreSQL

- **Descripción**: Sistema de gestión de bases de datos relacional y objeto.
- **Uso en el Proyecto**: Se utiliza para almacenar y gestionar datos de usuarios y otros datos de la aplicación.
- **Enlace**: [PostgreSQL](https://www.postgresql.org/)

### Express.js

- **Descripción**: Framework minimalista para Node.js que facilita la creación de aplicaciones web y APIs.
- **Uso en el Proyecto**: Se utiliza para construir la API del Backend, gestionando rutas y solicitudes HTTP.
- **Enlace**: [Express.js](https://expressjs.com/)

### React

- **Descripción**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Uso en el Proyecto**: Se utiliza para construir la interfaz de usuario del Frontend, proporcionando una experiencia interactiva y dinámica.
- **Enlace**: [React](https://reactjs.org/)

### Node.js

- **Descripción**: Entorno de ejecución para JavaScript en el lado del servidor.
- **Uso en el Proyecto**: Se utiliza para ejecutar el código del Backend y manejar la lógica del servidor.
- **Enlace**: [Node.js](https://nodejs.org/)

### Next.js

- **Descripción:** Framework de React que permite el renderizado del lado del servidor (SSR) y la generación estática de páginas (SSG).
- **Uso en el Proyecto:** Se utiliza para optimizar el Frontend, permitiendo un mejor rendimiento, SEO mejorado y una experiencia de usuario más rápida mediante renderizado dinámico y estático.
- **Enlace**: [Next.js](https://nextjs.org/)

  ### Otros Recursos y Librerías

- **Tailwind CSS:** Framework de CSS para un diseño rápido y responsivo.
  - **Enlace**: [Tailwind CSS](https://tailwindcss.com/)
