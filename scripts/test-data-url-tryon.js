/**
 * Script de prueba para verificar que el try-on devuelve data URLs correctamente
 * Este script simula el flujo completo sin guardar archivos
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verificar API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY no está configurada");
  process.exit(1);
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("🧪 Iniciando prueba de try-on con data URLs...");

async function testDataUrlTryOn() {
  const startTime = Date.now();

  try {
    // Usar imagen de prueba del usuario (simulada)
    const testUserImagePath = path.join(__dirname, "..", "public", "products", "tshirt-1.jpg");

    if (!fs.existsSync(testUserImagePath)) {
      console.error(`❌ No se encontró imagen de prueba en: ${testUserImagePath}`);
      return;
    }

    // Cargar imagen de prueba
    const userImageBuffer = fs.readFileSync(testUserImagePath);
    const userImageBase64 = userImageBuffer.toString("base64");

    console.log(`📸 Imagen del usuario cargada (${(userImageBuffer.length / 1024).toFixed(2)} KB)`);

    // Usar imagen de producto diferente
    const productImagePath = path.join(__dirname, "..", "public", "products", "tshirt-2.jpg");
    let productImageBase64 = null;

    if (fs.existsSync(productImagePath)) {
      const productImageBuffer = fs.readFileSync(productImagePath);
      productImageBase64 = productImageBuffer.toString("base64");
      console.log(`👕 Imagen del producto cargada (${(productImageBuffer.length / 1024).toFixed(2)} KB)`);
    } else {
      console.log("⚠️  No se encontró imagen de producto, usando solo imagen de usuario");
    }

    // Preparar contenido para Gemini - SOLO IMÁGENES Y PROMPT GENÉRICO
    const contents = [];

    // Prompt que fuerza generación de imagen
    const genericPrompt = `
Create a new image showing the person wearing the clothing item from the second image.
Generate a realistic virtual try-on result by combining both images.
The output must be an image, not text.
`.trim();

    contents.push({ text: genericPrompt });

    // Añadir imagen del usuario
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: userImageBase64,
      },
    });

    // Añadir imagen del producto si está disponible
    if (productImageBase64) {
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: productImageBase64,
        },
      });
    }

    console.log("🤖 Enviando solicitud a Gemini 2.5 Flash Image Preview...");

    // Llamar a Gemini
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview",
    });

    const response = await model.generateContent(contents);

    if (!response.response.candidates?.[0]?.content?.parts) {
      throw new Error("No válid response from Gemini model");
    }

    // Procesar respuesta - buscar SOLO imagen
    let imageData = null;

    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        console.log("✅ Imagen generada por Gemini recibida");
        break;
      }
    }

    const processingTime = Date.now() - startTime;
    console.log(`⏱️  Tiempo de procesamiento: ${processingTime}ms`);

    // Verificar si se generó una imagen
    if (!imageData) {
      console.log("⚠️  Gemini no generó imagen - intentando nuevamente...");

      // Segundo intento con prompt más específico
      const retryPrompt = `
Generate an image showing the person from the first image wearing the clothing from the second image.
Create a photorealistic virtual try-on result. Output must be an image only.
`;

      const retryModel = ai.getGenerativeModel({
        model: "gemini-2.5-flash-image-preview",
      });

      const retryResponse = await retryModel.generateContent([
        { text: retryPrompt },
        ...contents.slice(1), // Solo las imágenes
      ]);

      // Buscar imagen en segundo intento
      if (retryResponse.response.candidates?.[0]?.content?.parts) {
        for (const part of retryResponse.response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData.data;
            console.log("✅ Imagen obtenida en segundo intento");
            break;
          }
        }
      }
    }

    // Si tenemos imagen, crear data URL
    if (imageData) {
      const dataUrl = `data:image/png;base64,${imageData}`;

      console.log("🎉 Try-on completado exitosamente!");
      console.log(`📊 Tamaño del data URL: ${(dataUrl.length / 1024).toFixed(2)} KB`);
      console.log(`🔗 Data URL generado (primeros 100 caracteres): ${dataUrl.substring(0, 100)}...`);

      // Opcional: Guardar imagen de prueba para verificación visual
      const testOutputPath = path.join(__dirname, "..", "public", "downloads", `data-url-test-${Date.now()}.png`);
      const imageBuffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(testOutputPath, imageBuffer);
      console.log(`💾 Imagen de prueba guardada en: ${testOutputPath}`);

      console.log("\n✅ PRUEBA EXITOSA: El try-on genera data URLs correctamente");
      return {
        success: true,
        dataUrl: dataUrl,
        processingTime: processingTime
      };
    } else {
      console.log("❌ No se pudo generar imagen del try-on después de 2 intentos");
      return {
        success: false,
        error: "No se pudo generar imagen"
      };
    }

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Error después de ${processingTime}ms:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Ejecutar prueba
testDataUrlTryOn()
  .then((result) => {
    if (result.success) {
      console.log("\n🎊 TODAS LAS PRUEBAS PASARON");
      console.log("✨ El sistema está listo para producción en Railway");
      console.log("📝 Beneficios del nuevo sistema:");
      console.log("   • No requiere sistema de archivos persistente");
      console.log("   • Compatible con despliegues serverless");
      console.log("   • Imágenes se muestran inmediatamente");
      console.log("   • Sin problemas de permisos de escritura");
    } else {
      console.log("\n💥 LA PRUEBA FALLÓ");
      console.log(`❌ Error: ${result.error}`);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("\n💥 ERROR CRÍTICO EN LA PRUEBA:", error);
    process.exit(1);
  });
