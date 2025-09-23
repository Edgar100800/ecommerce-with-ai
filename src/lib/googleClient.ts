// lib/googleClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY!;
if (!apiKey) throw new Error("Falta GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(apiKey);

// Sistema de logging consistente con setup
const emojis = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "🔧",
  rocket: "🚀",
  loading: "⏳",
  image: "🖼️",
  api: "🤖",
  model: "🎯",
};

function logClient(
  message: string,
  type:
    | "success"
    | "error"
    | "warning"
    | "info"
    | "loading"
    | "api"
    | "model" = "info",
) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;

  const emoji = emojis[type] || emojis.info;
  console.log(`${emoji} ${prefix} ${message}`);
}

type GenPart = { inlineData: { data: string; mimeType: string } };

async function fileToGenPart(file: File): Promise<GenPart> {
  const buf = Buffer.from(await file.arrayBuffer());
  return {
    inlineData: {
      data: buf.toString("base64"),
      mimeType: file.type || "image/png",
    },
  };
}

async function localImageToGenPart(imagePath: string): Promise<GenPart> {
  // Construir la ruta completa al archivo
  const fullPath = path.join(process.cwd(), "public", imagePath);

  // Leer el archivo
  const buffer = fs.readFileSync(fullPath);

  // Determinar el tipo MIME basado en la extensión
  const ext = path.extname(imagePath).toLowerCase();
  let mimeType = "image/png";
  if (ext === ".jpg" || ext === ".jpeg") {
    mimeType = "image/jpeg";
  } else if (ext === ".svg") {
    mimeType = "image/svg+xml";
  } else if (ext === ".webp") {
    mimeType = "image/webp";
  }

  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

export const googleClient = {
  /**
   * Virtual try-on generalista con Gemini 2.5 Flash Image Preview (a.k.a. Nano Banana).
   * Hace "multi-image fusion": mezcla prenda + persona conservando identidad/pose.
   */
  async generateTryOnImage(opts: {
    userPhoto: File;
    productImage: File | string; // admite URL/Path si ya la tienes
    prompt: string;
  }): Promise<
    { success: true; imageBase64: string } | { success: false; error: string }
  > {
    try {
      logClient(
        "Iniciando generación try-on con Gemini 2.5 Flash Image Preview",
        "model",
      );

      // Prepara entradas
      logClient("Procesando foto del usuario...", "loading");
      const personPart = await fileToGenPart(opts.userPhoto);
      logClient("Foto del usuario procesada correctamente", "success");

      let productPart: GenPart;
      if (typeof opts.productImage === "string") {
        // Si es una ruta local de producto, leerla del filesystem
        if (
          opts.productImage.startsWith("/products/") ||
          opts.productImage.startsWith("products/")
        ) {
          const cleanPath = opts.productImage.startsWith("/")
            ? opts.productImage.substring(1)
            : opts.productImage;
          logClient(
            `Cargando imagen de producto desde: ${cleanPath}`,
            "loading",
          );
          productPart = await localImageToGenPart(cleanPath);
          logClient("Imagen de producto cargada desde filesystem", "success");
        } else {
          // Si tienes la imagen como URL externa, tráela a Buffer
          logClient(
            `Descargando imagen de producto desde: ${opts.productImage}`,
            "loading",
          );
          const res = await fetch(opts.productImage);
          const arr = Buffer.from(await res.arrayBuffer());
          productPart = {
            inlineData: {
              data: arr.toString("base64"),
              mimeType: res.headers.get("content-type") || "image/png",
            },
          };
          logClient("Imagen de producto descargada correctamente", "success");
        }
      } else {
        logClient("Procesando archivo de producto proporcionado...", "loading");
        productPart = await fileToGenPart(opts.productImage);
        logClient("Archivo de producto procesado correctamente", "success");
      }

      // Configura el modelo con salida de IMAGEN
      logClient("Configurando modelo Gemini 2.5 Flash Image Preview", "model");
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-image-preview",
        generationConfig: {
          responseMimeType: "image/png", // hace que devuelva imagen directamente como parte
        },
      });
      logClient("Modelo configurado con salida de imagen", "success");

      // Construye el prompt de edición/fusión
      const system = `
Eres un editor de imágenes para "virtual try-on".
Reglas:
- Mantén rostro, complexión, tono de piel, pelo y pose EXACTOS.
- No alteres el fondo ni la iluminación salvo lo mínimo para integrar la prenda.
- Ajusta la prenda al cuerpo de forma realista (tensión, arrugas, caída de tela).
- Respeta mangas, cuello y largos según la prenda.
- Fotorealismo prioritario (no caricaturesco).
- Si la prenda es blanca, evita "blowout": conserva textura y costuras.
`.trim();

      const userInstruction = `
Fusiona la prenda de la imagen del producto sobre la persona de la foto base.
Respeta todas las reglas. ${opts.prompt}
`.trim();

      logClient("Enviando solicitud de generación a Gemini...", "api");
      const res = await model.generateContent([
        { text: system },
        personPart,
        productPart,
        { text: userInstruction },
      ]);
      logClient("Respuesta recibida del modelo", "success");

      // Extrae la primera imagen generada (inlineData)
      logClient("Procesando respuesta del modelo...", "loading");
      const parts = res.response?.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(
        (p: unknown) =>
          (p as { inlineData?: { data?: string } })?.inlineData?.data,
      );
      if (!imgPart) {
        // a veces el modelo devuelve texto explicativo si algo fue bloqueado por safety
        const maybeText =
          parts.find((p: unknown) => (p as { text?: string })?.text)?.text ||
          "Sin detalles";
        logClient(
          `No se recibió imagen del modelo. Respuesta: ${maybeText}`,
          "warning",
        );
        return {
          success: false,
          error: `No se recibió imagen del modelo. Detalles: ${maybeText}`,
        };
      }

      const imageData = (imgPart as { inlineData: { data: string } }).inlineData
        .data;
      logClient(
        `Imagen try-on generada exitosamente - Tamaño: ${imageData.length} chars`,
        "success",
      );
      return {
        success: true,
        imageBase64: imageData,
      };
    } catch (e: unknown) {
      const errorMessage =
        (e as Error)?.message || "Fallo en generateTryOnImage";
      logClient(`Error en generateTryOnImage: ${errorMessage}`, "error");

      // Log de errores específicos para debugging
      if (errorMessage.includes("API_KEY")) {
        logClient("Problema con API Key - verifica configuración", "warning");
      } else if (errorMessage.includes("quota")) {
        logClient("Límite de cuota alcanzado", "warning");
      } else if (errorMessage.includes("not found")) {
        logClient(
          "Modelo no encontrado - puede no estar disponible aún",
          "warning",
        );
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Análisis de la foto del usuario (descriptivo) usando Gemini (visión).
   */
  async analyzeImage(
    file: File,
  ): Promise<{ success: boolean; description?: string; error?: string }> {
    try {
      logClient("Iniciando análisis de imagen con Gemini", "model");
      logClient(
        `Procesando imagen: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
        "info",
      );

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const img = await fileToGenPart(file);

      logClient("Enviando imagen a Gemini para análisis...", "api");
      const res = await model.generateContent([
        img,
        {
          text: "Describe brevemente a la persona (ropa, pose, iluminación, fondo).",
        },
      ]);

      const text = res.response.text() || "";
      logClient("Análisis de imagen completado exitosamente", "success");
      logClient(`Descripción generada: ${text.substring(0, 100)}...`, "info");

      return { success: true, description: text };
    } catch (e: unknown) {
      const errorMessage = (e as Error)?.message || "Error analizando imagen";
      logClient(`Error en análisis de imagen: ${errorMessage}`, "error");

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};
