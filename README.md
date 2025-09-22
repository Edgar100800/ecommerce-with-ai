# 🛍️ Ecommerce Images - Prueba Virtual con IA

Un ecommerce moderno que permite a los usuarios probar ropa virtualmente usando inteligencia artificial. Construido con **Next.js 14**, **Tailwind CSS** y **Google AI**.

## ✨ Características

- 🎯 **Prueba virtual con IA**: Ve cómo te queda cualquier prenda antes de comprar
- 📱 **Diseño responsive**: Optimizado para móviles y desktop
- ⚡ **Next.js 14**: App Router con Server Actions
- 🎨 **Tailwind CSS**: Diseño moderno y personalizable
- 🤖 **Google AI**: Integración con modelos de generación de imágenes
- 📦 **Sin base de datos**: Datos locales para desarrollo rápido

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd ecommerce-images
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Google AI API Key para nanobanana/Gemini
GEMINI_API_KEY=tu_api_key_aqui

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Ecommerce Images"

# Configuración de desarrollo
NODE_ENV=development
```

### 4. Obtener API Key de Google AI

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un nuevo proyecto o selecciona uno existente
3. Genera una API Key
4. Copia la API Key en tu archivo `.env.local`

### 5. Agregar imágenes de productos

Coloca las imágenes de tus productos en la carpeta `public/products/`. Los nombres deben seguir esta estructura:

```
public/products/
├── camiseta-blanca-1.jpg
├── camiseta-blanca-2.jpg
├── camiseta-blanca-3.jpg
├── jeans-slim-1.jpg
├── jeans-slim-2.jpg
├── jeans-slim-3.jpg
└── ... (más productos)
```

### 6. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
ecommerce-images/
│
├─ src/
│   ├─ actions/                 # Server Actions (lógica backend)
│   │   ├─ try-on.ts            # Acción para integrar con Google AI
│   │   └─ products.ts          # CRUD / listado de productos
│   │
│   ├─ app/
│   │   ├─ layout.tsx           # Layout principal con header/footer
│   │   ├─ page.tsx             # Home: grid de ProductCard
│   │   └─ product/
│   │       └─ [id]/page.tsx    # Vista detalle del producto
│   │
│   ├─ components/
│   │   ├─ ProductCard.tsx      # Card de producto
│   │   ├─ ProductDetail.tsx    # Layout detalle con galería/talles
│   │   ├─ UploadImageForm.tsx  # Formulario para subir foto (client)
│   │   └─ TryOnResult.tsx      # Muestra imagen generada
│   │
│   ├─ lib/
│   │   ├─ googleClient.ts      # Configuración SDK Google AI
│   │   └─ mock-data.ts         # Datos de productos mock
│   │
│   └─ types/
│       └─ index.ts             # Definiciones de TypeScript
│
├─ public/                      # Imágenes de productos estáticas
└─ ...
```

## 🎯 Flujo de Uso

### 1. Página Principal (`/`)
- Grid de productos con `ProductCard`
- Hero section explicativo
- Sección "¿Cómo funciona?"

### 2. Página de Producto (`/product/[id]`)
- Galería de imágenes del producto
- Selección de talla, color y cantidad
- Botón **"Probar la ropa"** para abrir el formulario
- Información detallada del producto

### 3. Prueba Virtual
1. El usuario hace clic en **"Probar la ropa"**
2. Se abre `UploadImageForm` para subir su foto
3. `tryOn` Server Action procesa la imagen con Google AI
4. `TryOnResult` muestra la imagen generada
5. El usuario puede descargar o compartir el resultado

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS 3.4
- **IA**: Google Generative AI (Gemini Pro Vision)
- **Validación**: Zod
- **Imágenes**: Next.js Image Component
- **Deployment**: Vercel (recomendado)

## 🎨 Personalización

### Agregar Nuevos Productos

Modifica el archivo `src/lib/mock-data.ts`:

```typescript
export const mockProducts: Product[] = [
  // ... productos existentes
  {
    id: '9',
    name: 'Tu Nuevo Producto',
    price: 49.99,
    description: 'Descripción del producto...',
    images: [
      '/products/nuevo-producto-1.jpg',
      '/products/nuevo-producto-2.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Azul', 'Rojo'],
    category: 'Camisetas',
    inStock: true
  }
];
```

### Modificar Estilos

Los estilos están en componentes individuales usando Tailwind CSS. Para cambios globales, modifica `src/app/globals.css`.

### Configurar Colores de Marca

En `tailwind.config.ts`, puedes personalizar la paleta de colores:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... más colores
        }
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Conecta tu repositorio a Vercel
3. Agrega las variables de entorno en Vercel Dashboard
4. Deploy automático ✅

### Otras Plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

### Estado Actual
- ✅ UI completa con componentes responsivos
- ✅ Server Actions configuradas
- ✅ Integración con Google AI preparada
- ⚠️ **Nota**: La integración con nanobanana está simulada ya que el modelo aún no está públicamente disponible
- ✅ Validación de formularios con Zod
- ✅ Gestión de estados con React hooks

### Próximas Mejoras
- [ ] Integración real con nanobanana cuando esté disponible
- [ ] Carrito de compras funcional
- [ ] Autenticación de usuarios
- [ ] Base de datos (Supabase/PlanetScale)
- [ ] Búsqueda avanzada de productos
- [ ] Reviews y calificaciones
- [ ] Sistema de favoritos

## 🆘 Solución de Problemas

> **💡 Tip:** Ejecuta `npm run diagnose` para obtener un diagnóstico completo y automático de todos los problemas.

### Error: "GEMINI_API_KEY no está configurada"
```bash
# Diagnóstico automático
npm run validate

# Si el error persiste:
echo "GEMINI_API_KEY=tu_api_key_real" > .env.local
npm run test-api
```

### Error: "Modelo no encontrado" o "Try-on no funciona"
```bash
# Probar conectividad completa
npm run test-api

# Ver logs detallados
npm run dev
# Los logs mostrarán exactamente qué está fallando
```

### Error: "Can't resolve image"
- Verifica que las imágenes existan en `public/products/`
- Asegúrate de que los nombres coincidan con los del mock data

### Error: "Module not found"
- Ejecuta `npm install` para instalar dependencias
- Verifica que las rutas de importación sean correctas

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autor

**Tu Nombre** - [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

⭐ Si te gusta este proyecto, ¡no olvides darle una estrella en GitHub!