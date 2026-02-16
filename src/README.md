# Sistema de Gestión - Frontend

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── types/
│   └── interfaces.ts          # Interfaces TypeScript centralizadas
├── i18n/
│   └── messages.ts            # Diccionario de mensajes
├── services/
│   ├── mockApi.ts             # Datos hardcodeados (simula backend)
│   └── apiClient.ts           # Cliente de API (wrapper)
├── pages/
│   ├── Login.tsx              # Página de login
│   ├── Dashboard.tsx          # Dashboard con gráficas
│   ├── Reportes.tsx           # Gestión de reportes (14 tabs)
│   ├── Jobs.tsx               # Revisión de jobs (10 tabs)
│   └── Perfil.tsx             # Configuración de perfil
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx        # Barra lateral colapsable
│   │   ├── Topbar.tsx         # Barra superior
│   │   └── MainLayout.tsx     # Layout principal
│   └── ui/                    # Componentes UI (shadcn)
├── utils/
│   ├── formatters.ts          # Funciones de formato
│   └── localState.ts          # Helpers de localStorage
└── config.ts                  # Configuración global
```

## 🔌 Conectar Backend Real

### 1. Configurar variable de entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=https://tu-api.com
```

### 2. Modificar `src/services/apiClient.ts`

Descomentar las líneas marcadas con `TODO` y reemplazar las llamadas a `mockApi` con llamadas reales usando axios:

```typescript
// ANTES (mock)
return mockApi.getDashboardData();

// DESPUÉS (real)
return api.get('/dashboard').then(res => res.data);
```

### 3. Endpoints esperados por el backend

- `POST /auth/login` - Login
- `POST /auth/verify` - Verificar contraseña del sistema
- `GET /dashboard` - Datos del dashboard
- `GET /reports/:tabId` - Obtener reporte
- `PUT /reports/:id` - Guardar reporte
- `POST /reports/send` - Enviar reporte
- `GET /jobs` - Listar jobs
- `GET /jobs/:id` - Obtener job
- `PUT /jobs/:id` - Guardar job
- `POST /jobs/:id/observations` - Agregar observación
- `GET /profile` - Obtener perfil
- `PUT /profile` - Actualizar perfil
- `GET /credentials` - Obtener credenciales
- `PUT /credentials/:id` - Actualizar credencial
- `POST /smtp/test` - Probar conexión SMTP

## 🎨 Personalización

### Colores y Tema

Editar `src/index.css` para cambiar los colores del tema:

```css
:root {
  --primary: 217 91% 45%;    /* Azul corporativo */
  --secondary: 214 32% 91%;  /* Gris claro */
  /* ... más variables */
}
```

### Mensajes y Textos

Editar `src/i18n/messages.ts` para cambiar los textos de la aplicación.

## 🔐 Credenciales de Demo

- **Email:** juan.perez@empresa.com
- **Contraseña:** admin123

## 📦 Dependencias Principales

- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- recharts (gráficas)
- axios (HTTP client)
- react-router-dom (routing)
- sonner (toasts)

## 🐛 Debugging

Los datos hardcodeados están en `src/services/mockApi.ts`. Puedes modificarlos para testing.

## 📝 Notas Importantes

- Todos los datos se simulan con latencia artificial (300-800ms)
- La persistencia actual es solo en memoria (se pierde al recargar)
- Para persistencia real entre recargas, activar localStorage en `mockApi.ts`
- Los iframes en Jobs tienen sandbox por seguridad
- Las contraseñas se muestran encriptadas (simulado)

## 🚀 Deploy

```bash
npm run build
# Los archivos compilados estarán en /dist
```

Subir la carpeta `dist` a tu servidor de hosting favorito (Vercel, Netlify, etc.)
