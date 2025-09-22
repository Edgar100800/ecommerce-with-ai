# 🛠️ Scripts de Validación y Diagnóstico - Guía Completa

## 📋 Scripts Disponibles

### 🔧 Validación de Configuración
- `npm run validate` - Validar configuración completa del proyecto
- `npm run check-setup` - Validar + verificar TypeScript

### 🤖 Diagnóstico de API
- `npm run test-api` - Probar conexión y funcionalidad de Gemini API
- `npm run diagnose` - Ejecutar validación completa + pruebas de API

---

## 🚀 Uso Rápido

### Para verificar que todo está configurado:
```bash
npm run diagnose
```

### Solo validar configuración:
```bash
npm run validate
```

### Solo probar API:
```bash
npm run test-api
```

---

## 📊 Scripts Detallados

### 1. `npm run validate` - Validador de Configuración

**¿Qué hace?**
Verifica que tu proyecto esté correctamente configurado para Try-On Virtual.

**Validaciones que ejecuta:**

#### ✅ Variables de Entorno
- [x] Archivo `.env.local` existe
- [x] `GEMINI_API_KEY` está configurada
- [x] API Key no es el placeholder por defecto
- [x] `NEXT_PUBLIC_APP_URL` presente (opcional)

#### ✅ Dependencias
- [x] `@google/generative-ai` instalada
- [x] `next` framework presente
- [x] `zod` para validación
- [x] `server-only` para server actions

#### ✅ Imágenes de Productos
- [x] Directorio `public/products/` existe
- [x] Imágenes de prueba disponibles:
  - `camiseta-blanca-1.jpg`
  - `jeans-slim-1.svg`  
  - `sudadera-capucha-1.svg`

#### ✅ Estructura de Archivos
- [x] `src/lib/googleClient.ts` - Cliente principal
- [x] `src/actions/try-on.ts` - Server action
- [x] `src/components/TryOnResult.tsx` - UI component
- [x] `src/types/index.ts` - Definiciones de tipos

#### ✅ Configuración TypeScript
- [x] `npm run type-check` ejecuta sin errores
- [x] Tipos correctos en toda la aplicación

#### ✅ Servidor Next.js
- [x] Configuración de Next.js válida
- [x] Build process funcional

**Salida Ejemplo:**
```
🚀 Try-On Virtual - Validador de Configuración

🚀 [10:30:15] Validando Variables de Entorno

✅ [10:30:15] Archivo .env.local encontrado
✅ [10:30:15] GEMINI_API_KEY configurada
✅ [10:30:15] NEXT_PUBLIC_APP_URL configurada

🚀 [10:30:16] Validando Dependencias

✅ [10:30:16] Google Generative AI SDK: v0.24.1
✅ [10:30:16] Next.js Framework: v14.2.32
✅ [10:30:16] Validación de esquemas: v4.1.11
✅ [10:30:16] Server-only utilities: v0.0.1

============================================================
🚀 RESUMEN DE VALIDACIÓN

✅ [10:30:18] ¡Configuración completamente válida!
🔧 [10:30:18] El sistema Try-On Virtual está listo para usar

🚀 Próximos pasos:
   1. npm run dev
   2. Ir a http://localhost:3000/product/1
   3. Probar "Probar Virtualmente"
   4. O usar /diagnostic para pruebas

============================================================
```

### 2. `npm run test-api` - Diagnóstico de API

**¿Qué hace?**
Prueba la conexión y funcionalidad completa con Gemini API.

**Pruebas que ejecuta:**

#### 🔌 Conexión Básica
- [x] API Key válida
- [x] Conexión con `gemini-1.5-flash`
- [x] Respuesta correcta del modelo

#### 🎯 Modelo de Imagen
- [x] Acceso a `gemini-2.5-flash-image-preview`
- [x] Configuración `responseMimeType: "image/png"`
- [x] Procesamiento de imágenes funcional

#### 🎨 Generación Try-On Completa
- [x] Carga de imagen de producto desde filesystem
- [x] Procesamiento multi-imagen (persona + prenda)
- [x] Generación de imagen try-on
- [x] Extracción correcta de `inlineData`

**Salida Ejemplo:**
```
🤖 Try-On Virtual - Diagnóstico de API

✅ [10:35:10] GEMINI_API_KEY cargada correctamente

🚀 [10:35:10] Probando conexión básica con Gemini API

⏳ [10:35:10] Enviando solicitud de prueba...
✅ [10:35:12] Conexión con Gemini API exitosa
🔧 [10:35:12] Respuesta recibida: Hello! I'm doing well, thank you for asking...

🚀 [10:35:12] Probando modelo de imágenes Gemini 2.5 Flash Image Preview

⏳ [10:35:12] Intentando acceder al modelo de generación de imágenes...
✅ [10:35:15] Modelo Gemini 2.5 Flash Image Preview accesible
✅ [10:35:15] Configuración de salida de imagen válida

🚀 [10:35:15] Probando generación de Try-On completa

⏳ [10:35:15] Simulando flujo completo de try-on...
✅ [10:35:15] Imagen de producto encontrada
✅ [10:35:18] ¡Try-On generado exitosamente!
✅ [10:35:18] Imagen base64 recibida del modelo
🔧 [10:35:18] Tamaño de imagen: 15247 chars

============================================================
🚀 RESULTADOS DEL DIAGNÓSTICO

📊 Resumen de pruebas:
   Total: 3
   Exitosas: 3
   Fallidas: 0

🔍 Detalles por prueba:
   1. basic_connection: ✅ ÉXITO
   2. image_model: ✅ ÉXITO  
   3. tryon_generation: ✅ ÉXITO

💡 Recomendaciones:
   ✅ ¡Todo funcionando perfectamente!
   - Ejecuta: npm run dev
   - Ve a: http://localhost:3000/product/1
   - Prueba la función "Probar Virtualmente"

============================================================
```

### 3. `npm run diagnose` - Diagnóstico Completo

**¿Qué hace?**
Ejecuta validación completa + pruebas de API en secuencia.

Equivale a:
```bash
npm run validate && npm run test-api
```

### 4. `npm run check-setup` - Validación + TypeScript

**¿Qué hace?**
Validación completa + verificación de tipos TypeScript.

Equivale a:
```bash
npm run validate && npm run type-check
```

---

## 🚨 Solución de Problemas

### Error: "Falta GEMINI_API_KEY"

**Problema:**
```
❌ [10:30:15] GEMINI_API_KEY no encontrada en .env.local
```

**Solución:**
```bash
# 1. Crear archivo .env.local
echo "GEMINI_API_KEY=tu_api_key_aqui" > .env.local

# 2. Obtener API key en https://aistudio.google.com/
# 3. Reemplazar "tu_api_key_aqui" con tu key real
# 4. Ejecutar de nuevo: npm run validate
```

### Error: "Modelo no encontrado"

**Problema:**
```
❌ [10:35:12] Error con modelo de imagen: Model not found
```

**Explicación:**
- `gemini-2.5-flash-image-preview` está en preview limitado
- No todos tienen acceso aún
- **Esto es normal y esperado**

**Solución:**
- El sistema funcionará con análisis de texto
- Solicita acceso en Google AI Studio
- Espera disponibilidad pública del modelo

### Error: "Límite de cuota alcanzado"

**Problema:**
```
❌ [10:35:12] Error en conexión: quota exceeded
```

**Solución:**
```bash
# 1. Esperar reset de cuota (24 horas)
# 2. O upgradar plan en Google AI Studio
# 3. Verificar uso en: https://aistudio.google.com/
```

### Error: "Imagen de producto no encontrada"

**Problema:**
```
❌ [10:35:15] Imagen de producto no encontrada
```

**Solución:**
```bash
# 1. Verificar que existe el archivo
ls -la public/products/camiseta-blanca-1.jpg

# 2. Si no existe, ejecutar setup
npm run setup

# 3. O crear manualmente las imágenes requeridas
```

### Error de TypeScript

**Problema:**
```
❌ [10:30:17] Errores de TypeScript encontrados
```

**Solución:**
```bash
# 1. Ver errores específicos
npm run type-check

# 2. Corregir errores mostrados
# 3. Ejecutar de nuevo: npm run check-setup
```

---

## 🔧 Scripts de Desarrollo Adicionales

### Limpieza y Reset
```bash
# Limpiar build
npm run clean

# Limpiar imágenes generadas
npm run clean-images

# Reinstalar dependencias
rm -rf node_modules && npm install

# Setup completo desde cero
npm run clean && npm install && npm run setup
```

### Debugging
```bash
# Ver logs detallados del servidor
npm run dev
# Los logs aparecen con emojis y timestamps

# Verificar archivos críticos
ls -la src/lib/googleClient.ts
ls -la src/actions/try-on.ts
ls -la public/products/

# Verificar variables de entorno
grep GEMINI .env.local
```

---

## 📈 Interpretación de Resultados

### ✅ Todo Verde (Éxito Total)
- **Configuración:** Perfecta
- **API:** Funcional  
- **Modelo de Imagen:** Disponible
- **Acción:** ¡Usar el try-on inmediatamente!

### ⚠️ Amarillo con Advertencias
- **Configuración:** Buena
- **API:** Funcional básica
- **Modelo de Imagen:** No disponible (normal)
- **Acción:** Usar try-on con análisis de texto

### ❌ Rojo con Errores
- **Configuración:** Problemas críticos
- **API:** No funcional
- **Acción:** Corregir errores antes de continuar

---

## 🎯 Flujo de Trabajo Recomendado

### Primera vez configurando:
```bash
# 1. Configurar API key
echo "GEMINI_API_KEY=tu_api_key_real" > .env.local

# 2. Validar todo
npm run diagnose

# 3. Si todo está verde, usar try-on
npm run dev
```

### Antes de hacer cambios importantes:
```bash
# 1. Verificar que todo funciona
npm run check-setup

# 2. Hacer tus cambios

# 3. Verificar que no rompiste nada
npm run diagnose
```

### Para debugging de problemas:
```bash
# 1. Validación básica
npm run validate

# 2. Si pasa, probar API
npm run test-api

# 3. Si falla, revisar logs específicos
# Los scripts muestran exactamente qué falló
```

---

## 💡 Tips y Mejores Prácticas

### 🔑 API Key Management
- Nunca hagas commit de tu API key real
- Usa nombres descriptivos en tu Google AI Studio
- Rota tu API key periódicamente

### 📊 Monitoreo de Cuotas
- Revisa tu uso en Google AI Studio
- Los scripts te avisan si alcanzas límites
- Considera upgradar si usas mucho

### 🛠️ Desarrollo
- Ejecuta `npm run diagnose` después de cambios
- Los scripts usan el mismo logging que la app
- Usa los emojis como referencia rápida visual

### 🚀 Producción
- Ejecuta `npm run check-setup` antes de deploy
- Verifica que todas las validaciones pasen
- Configura monitoring para errores de API

---

**¿Problemas? Los scripts te dirán exactamente qué está mal y cómo solucionarlo.** 🎯