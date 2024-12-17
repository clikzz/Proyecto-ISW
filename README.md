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



### Frontend



## Arquitectura del Proyecto

Este proyecto está dividido en dos partes principales: el Backend y el Frontend. A continuación, se muestra la estructura del Backend:

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
- [Next.js](https://nextjs.org/)

### Clonación del Repositorio

Primero, clona el repositorio en tu máquina local usando el siguiente comando:

```bash
git clone https://github.com/tu-usuario/Plantilla-ISW-Proyecto-2024.git
```

### Configuración del Backend

1. Accede al directorio del Backend:

```bash
cd backend
```

2. Instala las dependencias del proyecto:

```bash
npm install
```

3. Renombra el archivo `.env.example` a `.env` y configura las variables de entorno necesarias.

```bash
HOST= localhost (Proyecto en local) o IP servidor (Proyecto en producción)
PORT= (3000-5000) (Proyecto en local) o Puerto 80 (Proyecto en producción)
DB_USERNAME= Nombre de usuario en la instancia de PostgreSQL
PASSWORD= Contraseña de usuario en la instancia de PostgreSQL
DATABASE= Nombre de la base de datos
ACCESS_TOKEN_SECRET= Secreto del JWT
cookieKey= Llave de la cookie
```

4. Configura PostgreSQL:

- Crea una base de datos en PostgreSQL con el nombre especificado en el archivo `.env`.

5. Inicia el servidor:

```bash
npm run dev
```

### Configuración del Frontend

1. Accede al directorio del Frontend:

```bash
cd frontend
```

2. Instala las dependencias del proyecto:

```bash
npm install
```

3. Renombra el archivo `.env.example` a `.env` y configura las variables de entorno necesarias.

```bash
VITE_BASE_URL=http://<IP:(Puerto 80 -> 4 digitos)>/api
```

4. Inicia la aplicación Frontend:

```bash
npm run dev
```

### Configuración de DBeaver y PostgreSQL

1. Instalación de PostgreSQL:

- Descarga e instala PostgreSQL desde el siguiente enlace: [PostgreSQL](https://www.postgresql.org/download/).
- Durante la instalación, configura la contraseña para la base de datos.
  

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
