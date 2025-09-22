"use server";
import "server-only";
import { GoogleGenAI } from "@google/genai";
import { getProductById } from "@/lib/mock-data";
import type { TryOnResponse } from "@/types";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Sistema de logging consistente
const emojis = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "🔧",
  loading: "⏳",
};

function logTryOn(
  message: string,
  type: "success" | "error" | "warning" | "info" | "loading" = "info",
) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  const emoji = emojis[type] || emojis.info;
  console.log(`${emoji} ${prefix} ${message}`);
}

// Verificar API Key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TryOnSchema = z.object({
  productId: z.string().min(1, "ID de producto requerido"),
  photo: z
    .instanceof(File, { message: "Foto requerida" })
    .refine((f) => f.size > 0, "La foto no puede estar vacía")
    .refine((f) => f.size <= 5 * 1024 * 1024, "La foto debe ser menor a 5MB")
    .refine(
      (f) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type),
      "Solo JPG, PNG o WebP",
    ),
});

async function fileToBase64(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  return buf.toString("base64");
}

export async function tryOn(formData: FormData): Promise<TryOnResponse> {
  const startTime = Date.now();

  try {
    logTryOn("Iniciando proceso de try-on virtual", "loading");

    const raw = {
      productId: formData.get("productId") as string,
      photo: formData.get("photo") as File,
    };
    const { productId, photo } = TryOnSchema.parse(raw);

    logTryOn(`Datos recibidos - Producto ID: ${productId}`, "info");
    logTryOn(
      `Foto del usuario: ${photo.name} (${(photo.size / (1024 * 1024)).toFixed(2)} MB, ${photo.type})`,
      "info",
    );

    const product = getProductById(productId);
    if (!product) {
      logTryOn(`Producto no encontrado: ${productId}`, "error");
      return { success: false, error: "Producto no encontrado" };
    }

    if (!product.inStock) {
      logTryOn(`Producto fuera de stock: ${product.name}`, "warning");
      return {
        success: false,
        error: "Este producto no está disponible actualmente",
      };
    }

    logTryOn("Producto encontrado y disponible", "info");

    // Preparar contenido para Gemini - SOLO IMÁGENES Y PROMPT GENÉRICO
    const contents: (
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    )[] = [];

    // Prompt que fuerza generación de imagen
    const genericPrompt = `
Create a new image showing the person wearing the clothing item from the second image.
Generate a realistic virtual try-on result by combining both images.
The output must be an image, not text.
`.trim();

    contents.push({ text: genericPrompt });

    // Convertir foto del usuario
    const photoBase64 = await fileToBase64(photo);
    contents.push({
      inlineData: {
        mimeType: photo.type || "image/png",
        data: photoBase64,
      },
    });

    // Cargar imagen del producto
    const productImageUrl = product.images[0];
    if (productImageUrl) {
      try {
        const productImagePath = path.join(
          process.cwd(),
          "public",
          productImageUrl,
        );
        if (fs.existsSync(productImagePath)) {
          const productBuffer = fs.readFileSync(productImagePath);
          const productBase64 = productBuffer.toString("base64");
          contents.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: productBase64,
            },
          });
          logTryOn("Imágenes preparadas para análisis", "info");
        }
      } catch (error) {
        logTryOn(`Error cargando imagen del producto: ${error}`, "warning");
      }
    }

    logTryOn(
      "Enviando solicitud a Gemini 2.5 Flash Image Preview...",
      "loading",
    );

    // Llamar a Gemini con configuración para forzar imagen
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No válid response from Gemini model");
    }

    // Procesar respuesta - buscar SOLO imagen
    let imageData = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        logTryOn("Imagen generada por Gemini recibida", "success");
        break;
      }
    }

    const processingTime = Date.now() - startTime;
    logTryOn(`Tiempo de procesamiento: ${processingTime}ms`, "info");

    // Verificar si se generó una imagen
    if (!imageData) {
      logTryOn("Gemini no generó imagen - intentando nuevamente...", "warning");

      // Segundo intento con prompt más específico
      const retryPrompt = `
Generate an image showing the person from the first image wearing the clothing from the second image.
Create a photorealistic virtual try-on result. Output must be an image only.
`;

      const retryResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [
          { text: retryPrompt },
          ...contents.slice(1), // Solo las imágenes
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 16,
          topP: 0.8,
        },
      });

      // Buscar imagen en segundo intento
      if (retryResponse.candidates?.[0]?.content?.parts) {
        for (const part of retryResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData.data;
            logTryOn("Imagen obtenida en segundo intento", "success");
            break;
          }
        }
      }
    }

    // Si finalmente tenemos imagen, guardarla
    if (imageData) {
      const timestamp = Date.now();
      const filename = `tryon-${timestamp}.png`;
      const filepath = path.join(
        process.cwd(),
        "public",
        "downloads",
        filename,
      );

      // Crear directorio si no existe
      const downloadsDir = path.dirname(filepath);
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      const imageBuffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(filepath, imageBuffer);

      logTryOn(`Imagen try-on guardada: /downloads/${filename}`, "success");
      logTryOn("Try-on completado exitosamente", "success");

      return {
        success: true,
        result: `/downloads/${filename}`,
      };
    }

    // Si aún no hay imagen después de ambos intentos
    logTryOn("No se pudo generar imagen del try-on", "error");
    return {
      success: false,
      error:
        "El modelo no pudo generar una imagen del try-on. Intenta con una foto diferente.",
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    logTryOn(`Error crítico después de ${processingTime}ms`, "error");

    if (error instanceof z.ZodError) {
      const first = error.issues[0];
      logTryOn(
        `Error de validación: ${first.message} (campo: ${first.path.join(".")})`,
        "error",
      );
      return { success: false, error: `Error de validación: ${first.message}` };
    }

    logTryOn(`Error no manejado: ${(error as Error).message}`, "error");
    return {
      success: false,
      error: (error as Error).message || "Error interno del servidor",
    };
  }
}

export async function analyzeUserPhoto(formData: FormData): Promise<{
  success: boolean;
  description?: string;
  error?: string;
}> {
  try {
    logTryOn("Iniciando análisis de imagen del usuario", "loading");

    const photo = formData.get("photo") as File;

    if (!photo || photo.size === 0) {
      logTryOn("No se proporcionó ninguna foto", "error");
      return {
        success: false,
        error: "No se proporcionó ninguna foto",
      };
    }

    logTryOn(
      `Analizando imagen: ${photo.name || "sin nombre"} (${(photo.size / (1024 * 1024)).toFixed(2)} MB, ${photo.type})`,
      "info",
    );

    // Validar tipo de archivo
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        photo.type,
      )
    ) {
      logTryOn(`Formato no válido: ${photo.type}`, "warning");
      return {
        success: false,
        error: "Formato de imagen no válido. Use JPG, PNG o WebP",
      };
    }

    // Validar tamaño
    if (photo.size > 5 * 1024 * 1024) {
      logTryOn(
        `Imagen demasiado grande: ${(photo.size / (1024 * 1024)).toFixed(2)} MB`,
        "warning",
      );
      return {
        success: false,
        error: "La imagen es demasiado grande. Máximo 5MB",
      };
    }

    logTryOn("Enviando imagen a Gemini para análisis...", "loading");

    // Preparar contenido para Gemini
    const photoBase64 = await fileToBase64(photo);
    const contents = [
      {
        text: "Describe brevemente a la persona (ropa, pose, iluminación, fondo).",
      },
      {
        inlineData: {
          mimeType: photo.type || "image/png",
          data: photoBase64,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: contents,
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No valid response from Gemini model for analysis");
    }

    const description = response.candidates[0].content.parts[0]?.text || "";

    if (description) {
      logTryOn("Análisis de imagen completado exitosamente", "success");
      logTryOn(
        `Descripción generada: ${description.substring(0, 100)}...`,
        "info",
      );
      return { success: true, description };
    } else {
      logTryOn("No se recibió descripción del análisis", "warning");
      return {
        success: false,
        error: "No se pudo analizar la imagen",
      };
    }
  } catch (error) {
    logTryOn(
      `Error inesperado en análisis: ${(error as Error).message}`,
      "error",
    );
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al analizar la imagen",
    };
  }
}
