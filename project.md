# 🛍️ Proyecto “Ecommerce-Images” con Prueba de Ropa (Next 14 + Tailwind 3.4)

## 🎯 Objetivo

Construir una web estilo **ecommerce** donde el usuario:

1. Vea un catálogo de prendas en **cards**.
2. Al entrar a **/product/\[id]**, observe la ficha de producto con un diseño similar a la captura de ejemplo.
3. Suba su foto y haga clic en **“Probar la ropa”** para que el modelo de Google **nanobanana** genere una imagen vistiendo esa prenda.

Toda la lógica de backend se maneja con **Server Actions** en `src/actions` (sin rutas API).

---

## 🗂️ Estructura de Carpetas

```
ecommerce-images/
│
├─ src/
│   ├─ actions/                 # Server Actions (lógica backend)
│   │   ├─ try-on.ts            # Acción para integrar con Google nanobanana
│   │   └─ products.ts          # (opcional) CRUD / listado de productos
│   │
│   ├─ app/
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
│   │   └─ googleClient.ts      # Configuración SDK Google AI
│   │
│   └─ styles/
│       └─ globals.css
│
├─ public/                      # Imágenes de productos estáticas
├─ drizzle/                      # (opcional) esquema/seed si usas DB
├─ package.json
└─ tailwind.config.js
```

---

## 📌 Flujo Principal

1. **Home (`/`)**

   * Grid de productos (`ProductCard`) con imagen, nombre, precio.
   * Datos desde un mock o DB (puedes usar Drizzle si quieres persistencia).

2. **Detalle (`/product/[id]`)**

   * Layout similar al ecommerce de la imagen: galería, talles, precio, descripción.
   * Botón **“Probar la ropa”** que abre `UploadImageForm`.

3. **Probar la prenda**

   * `UploadImageForm` (Client) envía un `<form>` a la acción `tryOn` en `src/actions/try-on.ts`.
   * `tryOn` (Server Action) recibe:

     * Foto de la persona.
     * Imagen de la prenda.
   * Llama a **Google nanobanana** y devuelve la imagen generada (base64/URL).
   * `TryOnResult` muestra la foto resultante.

---

## 🧩 Detalle de Server Action

```ts
// src/actions/try-on.ts
"use server";
import "server-only";
import { googleClient } from "@/lib/googleClient";

export async function tryOn(formData: FormData) {
  const userPhoto = formData.get("photo") as File;
  const productImg = formData.get("productImg") as string;

  // Ejemplo de prompt
  const prompt = `Vistiendo la prenda de la imagen ${productImg} sobre la persona de la foto`;

  // Llamada a Google nanobanana (SDK/fetch según doc oficial)
  const output = await googleClient.generateImage({
    model: "nanobanana",
    prompt,
    image: userPhoto,
  });

  return { result: output.base64 };
}
```

---

## 🚀 Roadmap de Desarrollo

### Fase 1 – Setup

* [ ] Crear proyecto:

  ```bash
  npx create-next-app@14 ecommerce-images --typescript --eslint
  ```
* [ ] Instalar Tailwind 3.4:

  ```bash
  npm install -D tailwindcss@3.4.1 postcss autoprefixer
  npx tailwindcss init -p
  ```

### Fase 2 – UI Ecommerce

* [ ] Implementar `ProductCard` y `ProductDetail` con Tailwind.
* [ ] Configurar mock/DB de productos.
* [ ] Navegación `/` → `/product/[id]`.

### Fase 3 – Integración nanobanana

* [ ] Crear `UploadImageForm` con `<form action={tryOn}>`.
* [ ] Implementar `tryOn` en `src/actions/try-on.ts`.
* [ ] Mostrar `TryOnResult` con la imagen generada.

### Fase 4 – Extras

* [ ] Validación de archivos (zod/mime).
* [ ] Estados de carga (`useTransition`).
* [ ] Deploy en Vercel (Server Actions habilitadas).

---

## 🛠️ Stack

* **Frontend/UI:** Next 14 (App Router, Server Components), Tailwind 3.4, Radix UI.
* **Backend integrado:** Server Actions en `src/actions`.
* **IA:** Google **nanobanana** (image generation).
* **BD (opcional):** Drizzle + Postgres.
* **Deploy:** Vercel.
