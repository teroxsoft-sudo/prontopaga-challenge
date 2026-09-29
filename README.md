# ProntoPaga Full Stack Challenge

Solución desarrollada para el desafío técnico Full Stack de **ProntoPaga**.

La aplicación permite autenticar usuarios mediante JWT y consultar un **score financiero determinista asociado a un RUT chileno**, aplicando reglas de autorización según el rol del usuario.

El proyecto está construido con **Node.js, Express, TypeScript y React**, manteniendo una separación clara entre backend y frontend.

---

## Características principales

### Backend

- API REST desarrollada con Node.js, Express y TypeScript.
- Autenticación mediante JSON Web Token (JWT).
- Validación de firma y expiración del token.
- Autorización basada en roles.
- Validación de RUT chileno.
- Normalización y formateo de RUT.
- Generación determinista de score financiero entre `0` y `100`.
- Manejo de códigos HTTP `400`, `401`, `403` y `404`.
- Configuración mediante variables de entorno.
- CORS configurable.
- TypeScript en modo estricto.
- Tests unitarios y de integración con Vitest y Supertest.

### Frontend

- React + TypeScript.
- SPA desarrollada con Vite.
- React Router para navegación.
- Rutas protegidas.
- Manejo de sesión mediante `sessionStorage`.
- Login con credenciales mock.
- Vista diferenciada según rol.
- Consulta de score financiero.
- Manejo visual de errores.
- Interfaz responsive.

---

## Arquitectura

```text
prontopaga-challenge/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── mocks/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Tecnologías utilizadas

### Backend

| Tecnología | Uso |
|---|---|
| Node.js | Runtime |
| Express | API REST |
| TypeScript | Tipado estático |
| JSON Web Token | Autenticación y autorización |
| CORS | Control de acceso desde frontend |
| dotenv | Variables de entorno |
| Vitest | Testing |
| Supertest | Tests de integración HTTP |

### Frontend

| Tecnología | Uso |
|---|---|
| React | Interfaz de usuario |
| TypeScript | Tipado estático |
| Vite | Desarrollo y build |
| React Router | Navegación y rutas protegidas |
| Fetch API | Comunicación con backend |
| CSS | Diseño responsive |

---

# Ejecución del proyecto

## Requisitos

Se requiere tener instalado:

- Node.js
- npm
- Git

---

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd prontopaga-challenge
```

---

# Backend

## 2. Instalar dependencias

```bash
cd backend
npm install
```

## 3. Configurar variables de entorno

Crear un archivo:

```text
backend/.env
```

basándose en:

```text
backend/.env.example
```

Ejemplo:

```env
PORT=3000
JWT_SECRET=change-this-secret
FRONTEND_URL=http://localhost:5173
```

> El archivo `.env` no debe almacenarse en el repositorio.

## 4. Ejecutar backend

Modo desarrollo:

```bash
npm run dev
```

API disponible en:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "ProntoPaga API"
}
```

---

# Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crear:

```text
frontend/.env
```

basándose en `.env.example`.

Ejemplo:

```env
VITE_API_URL=http://localhost:3000
```

Ejecutar:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

---

# Credenciales de prueba

La autenticación utiliza usuarios mock, de acuerdo con los requerimientos del desafío.

### Usuario

```text
Usuario: user
Contraseña: User123!
RUT: 12.345.678-5
Rol: user
```

El usuario solamente puede consultar el RUT asociado a su token.

### Administrador

```text
Usuario: admin
Contraseña: Admin123!
Rol: admin
```

El administrador puede consultar cualquier RUT válido.

> Las contraseñas en texto plano se utilizan exclusivamente por tratarse de credenciales mock para el desafío técnico. En un entorno productivo deberían almacenarse utilizando un mecanismo seguro de hashing.

---

# API REST

## POST `/login`

Autentica un usuario.

### Request

```json
{
  "username": "user",
  "password": "User123!"
}
```

### Response

```json
{
  "token": "<JWT>",
  "user": {
    "id": 2,
    "username": "user",
    "role": "user",
    "rut": "12345678-5"
  }
}
```

El JWT contiene información necesaria para autorización, incluyendo:

```text
sub
role
rut
```

El campo `rut` se incorpora para usuarios de rol `user`.

---

## GET `/score/:rut`

Endpoint protegido mediante JWT.

Header:

```text
Authorization: Bearer <JWT>
```

Ejemplo:

```text
GET /score/12345678-5
```

Respuesta:

```json
{
  "rut": "12.345.678-5",
  "score": 61,
  "fecha": "2026-09-28T00:00:00.000Z"
}
```

---

# Reglas de autorización

La autorización se valida en el backend y no depende del frontend.

### Rol `user`

Puede consultar exclusivamente el RUT asociado a su JWT.

Intentar consultar otro RUT produce:

```text
HTTP 403 Forbidden
```

### Rol `admin`

Puede consultar cualquier RUT chileno válido.

---

# Generación del score

El score se genera mediante una función determinista basada en el RUT normalizado.

Esto significa que:

```text
mismo RUT → mismo score
```

El resultado siempre se encuentra en el rango:

```text
0 - 100
```

No se utiliza `Math.random()`.

Esta estrategia permite reproducibilidad y facilita las pruebas automatizadas.

---

# Validación de RUT

Antes de calcular el score, el backend:

1. elimina puntos y espacios;
2. normaliza el dígito verificador;
3. valida la estructura;
4. verifica el dígito verificador mediante el algoritmo Módulo 11;
5. normaliza el RUT antes de generar el score.

Ejemplo:

```text
12345678-5
```

se presenta como:

```text
12.345.678-5
```

---

# Seguridad

La solución implementa:

- autenticación mediante JWT;
- expiración del token;
- validación de firma;
- autorización por rol;
- restricción por RUT;
- validación de datos de entrada;
- secretos mediante variables de entorno;
- CORS configurable;
- rutas protegidas en frontend;
- validación de autorización nuevamente en backend.

La seguridad de acceso no depende únicamente de la interfaz de usuario.

---

# Manejo de errores

La API utiliza códigos HTTP adecuados según cada escenario.

| Código | Situación |
|---:|---|
| `200` | Operación exitosa |
| `400` | Datos o RUT inválidos |
| `401` | Credenciales/token inválido o ausente |
| `403` | Usuario autenticado sin autorización |
| `404` | Recurso no encontrado |

---

# Tests

El backend incluye pruebas unitarias y de integración.

Ejecutar:

```bash
cd backend
npm test
```

Las pruebas cubren, entre otros escenarios:

- validación de RUT;
- normalización de RUT;
- formateo de RUT;
- score entre `0` y `100`;
- score determinista;
- autenticación válida;
- credenciales incorrectas;
- acceso sin JWT;
- consulta del RUT propio;
- restricción de acceso a otro RUT;
- permisos de administrador;
- rechazo de RUT inválido.

---

# Validación TypeScript

```bash
npm run typecheck
```

---

# Build

## Backend

```bash
cd backend
npm run build
```

Ejecutar versión compilada:

```bash
npm start
```

## Frontend

```bash
cd frontend
npm run build
```

---

# Flujo de la aplicación

```text
Usuario
   │
   ▼
React SPA
   │
   │ POST /login
   ▼
Express API
   │
   ▼
Validación credenciales
   │
   ▼
JWT
   │
   ▼
React SPA
   │
   │ GET /score/:rut
   │ Authorization: Bearer JWT
   ▼
Middleware JWT
   │
   ▼
Validación rol / RUT
   │
   ▼
Validación RUT
   │
   ▼
Score determinista
   │
   ▼
Respuesta JSON
```

---

# Decisiones técnicas

### Sin base de datos

El desafío permite utilizar credenciales mock, por lo que incorporar una base de datos habría agregado complejidad sin aportar valor directo al requerimiento.

### Autorización en backend

Aunque el frontend limita las acciones según el rol, la autorización real se realiza nuevamente en la API.

Esto evita que un usuario pueda eludir las restricciones modificando el cliente.

### Score determinista

Se utiliza una función basada en el RUT en lugar de generación aleatoria.

Esto garantiza reproducibilidad y facilita testing.

### Separación de responsabilidades

El backend se divide en:

```text
routes
controllers
middleware
services
utils
types
```

evitando concentrar toda la lógica en los endpoints.

### Estado del frontend

Para el alcance del desafío no se incorporó una librería global de estado.

React Context es suficiente para manejar la sesión sin introducir complejidad innecesaria.

---

# Mejoras posibles para producción

En un entorno productivo podrían incorporarse:

- persistencia en base de datos;
- hashing de contraseñas;
- refresh tokens;
- rate limiting;
- Helmet y políticas adicionales de seguridad HTTP;
- logging estructurado;
- observabilidad y métricas;
- validación mediante schemas;
- CI/CD;
- containerización con Docker;
- tests E2E;
- despliegue cloud.

---

## Autor

**Mauricio Alejandro Caro Cabrera**

Ingeniero en Ejecución de Sistemas Computacionales e Informáticos.

Solución desarrollada como parte del desafío técnico Full Stack ProntoPaga.