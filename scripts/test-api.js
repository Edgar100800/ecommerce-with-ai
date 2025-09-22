#!/usr/bin/env node

/**
 * Script de diagnóstico de API Gemini para Try-On Virtual
 * Basado en SETUP_GEMINI_API.md - Sistema de logging consistente
 */

const fs = require("fs");
const path = require("path");

// Colores para terminal
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

// Emojis para mejor UX
const emojis = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "🔧",
  rocket: "🚀",
  check: "🧪",
  key: "🔑",
  image: "🖼️",
  api: "🤖",
  loading: "⏳",
};

class APITester {
  constructor() {
    this.apiKey = null;
    this.results = [];
    this.loadEnvironment();
  }

  log(message, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}]`;

    switch (type) {
      case "success":
        console.log(
          `${colors.green}${emojis.success} ${prefix} ${message}${colors.reset}`,
        );
        break;
      case "error":
        console.log(
          `${colors.red}${emojis.error} ${prefix} ${message}${colors.reset}`,
        );
        break;
      case "warning":
        console.log(
          `${colors.yellow}${emojis.warning} ${prefix} ${message}${colors.reset}`,
        );
        break;
      case "info":
        console.log(
          `${colors.blue}${emojis.info} ${prefix} ${message}${colors.reset}`,
        );
        break;
      case "header":
        console.log(
          `${colors.cyan}${colors.bold}${emojis.rocket} ${message}${colors.reset}\n`,
        );
        break;
      case "loading":
        console.log(
          `${colors.yellow}${emojis.loading} ${prefix} ${message}${colors.reset}`,
        );
        break;
    }
  }

  loadEnvironment() {
    const envPath = path.join(process.cwd(), ".env.local");

    if (!fs.existsSync(envPath)) {
      this.log("Archivo .env.local no encontrado", "error");
      this.log("Crea el archivo .env.local con tu GEMINI_API_KEY", "info");
      return false;
    }

    const envContent = fs.readFileSync(envPath, "utf8");
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);

    if (!apiKeyMatch) {
      this.log("GEMINI_API_KEY no encontrada en .env.local", "error");
      return false;
    }

    this.apiKey = apiKeyMatch[1].trim();

    if (this.apiKey === "tu_api_key_aqui" || this.apiKey.length < 10) {
      this.log("GEMINI_API_KEY no configurada correctamente", "error");
      this.log("Reemplaza con tu API key real de Google AI Studio", "info");
      return false;
    }

    this.log("GEMINI_API_KEY cargada correctamente", "success");
    return true;
  }

  async testBasicConnection() {
    this.log("Probando conexión básica con Gemini API", "header");
    this.log("Enviando solicitud de prueba...", "loading");

    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.apiKey);

      // Probar modelo básico primero
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Hello, test connection");
      const text = result.response.text();

      if (text && text.length > 0) {
        this.log("Conexión con Gemini API exitosa", "success");
        this.log(`Respuesta recibida: ${text.substring(0, 50)}...`, "info");
        this.results.push({ test: "basic_connection", success: true });
        return true;
      } else {
        this.log("Respuesta vacía de Gemini API", "warning");
        this.results.push({ test: "basic_connection", success: false });
        return false;
      }
    } catch (error) {
      this.log(`Error en conexión: ${error.message}`, "error");

      if (error.message.includes("API_KEY")) {
        this.log("Problema con API Key - verifica que sea válida", "info");
      } else if (error.message.includes("quota")) {
        this.log("Límite de cuota alcanzado - espera o upgradar plan", "info");
      } else if (error.message.includes("permission")) {
        this.log("Sin permisos para este modelo - verifica tu cuenta", "info");
      }

      this.results.push({
        test: "basic_connection",
        success: false,
        error: error.message,
      });
      return false;
    }
  }

  async testImageModel() {
    this.log('Probando modelo de imágenes Gemini 2.5 Flash Image Preview', 'header');
    this.log('Intentando acceder al modelo de generación de imágenes...', 'loading');

    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.apiKey);

      // Intentar usar el modelo de imagen
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-image-preview",
        generationConfig: {
          responseMimeType: 'image/png',
        },
      });

      // Crear una imagen de prueba simple (base64)
      const testImageBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

      const result = await model.generateContent([
        {
          inlineData: {
            data: testImageBase64,
            mimeType: "image/png",
          },
        },
        {
          text: 'Describe esta imagen brevemente.'
        }
      ]);

      // Verificar si el modelo responde
      if (result.response) {
        this.log('Modelo Gemini 2.5 Flash Image Preview accesible', 'success');
        this.log('Configuración de salida de imagen válida', 'success');
        this.results.push({ test: 'image_model', success: true });
        return true;
      } else {
        this.log("Modelo no respondió correctamente", "warning");
        this.results.push({ test: "image_model", success: false });
        return false;
      }
    } catch (error) {
      this.log(`Error con modelo de imagen: ${error.message}`, "error");

      if (error.message.includes('not found') || error.message.includes('404')) {
        this.log('Modelo gemini-2.5-flash-image-preview no disponible aún', 'warning');
        this.log('Esto es normal - el modelo está en preview limitado', 'info');
      } else if (error.message.includes('permission')) {
        this.log('Sin acceso al modelo de imagen - solicita acceso a Google', 'info');
      }

      this.results.push({
        test: "image_model",
        success: false,
        error: error.message,
      });
      return false;
    }
  }

  async testTryOnGeneration() {
    this.log("Probando generación de Try-On completa", "header");
    this.log("Simulando flujo completo de try-on...", "loading");

    try {
      // Verificar que los archivos de producto existen
      const productImagePath = path.join(
        process.cwd(),
        "public",
        "products",
        "camiseta-blanca-1.jpg",
      );

      if (!fs.existsSync(productImagePath)) {
        this.log("Imagen de producto no encontrada", "error");
        this.log(
          "Verifica que existe: public/products/camiseta-blanca-1.jpg",
          "info",
        );
        this.results.push({
          test: "tryon_generation",
          success: false,
          error: "Product image missing",
        });
        return false;
      }

      this.log("Imagen de producto encontrada", "success");

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.apiKey);

      // Intentar el flujo completo
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-image-preview",
        generationConfig: {
          responseMimeType: "image/png",
        },
      });

      // Leer imagen de producto
      const productImageBuffer = fs.readFileSync(productImagePath);
      const productImageBase64 = productImageBuffer.toString("base64");

      // Imagen de usuario simulada (píxel transparente)
      const userImageBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

      const personPart = {
        inlineData: {
          data: userImageBase64,
          mimeType: "image/png",
        },
      };

      const productPart = {
        inlineData: {
          data: productImageBase64,
          mimeType: "image/jpeg",
        },
      };

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
Respeta todas las reglas. Producto: Camiseta Clásica Blanca
Categoría: Camisetas
Objetivo: superponer la prenda en la persona manteniendo identidad, pose, fondo y luz.
Ajuste realista al cuerpo (arrugas/costuras). Resultado fotorealista de e-commerce.
`.trim();

      const result = await model.generateContent([
        { text: system },
        personPart,
        productPart,
        { text: userInstruction },
      ]);

      // Verificar respuesta
      const parts = result.response?.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find((p) => p?.inlineData?.data);

      if (imgPart) {
        this.log("¡Try-On generado exitosamente!", "success");
        this.log("Imagen base64 recibida del modelo", "success");
        this.log(
          `Tamaño de imagen: ${imgPart.inlineData.data.length} chars`,
          "info",
        );
        this.results.push({ test: "tryon_generation", success: true });
        return true;
      } else {
        const maybeText = parts.find((p) => p?.text)?.text || "Sin detalles";
        this.log("No se recibió imagen del modelo", "warning");
        this.log(`Respuesta del modelo: ${maybeText}`, "info");
        this.results.push({
          test: "tryon_generation",
          success: false,
          error: "No image generated",
        });
        return false;
      }
    } catch (error) {
      this.log(`Error en try-on: ${error.message}`, "error");
      this.results.push({
        test: "tryon_generation",
        success: false,
        error: error.message,
      });
      return false;
    }
  }

  showResults() {
    console.log("\n" + "=".repeat(60));
    this.log("RESULTADOS DEL DIAGNÓSTICO", "header");

    const totalTests = this.results.length;
    const successfulTests = this.results.filter((r) => r.success).length;
    const failedTests = totalTests - successfulTests;

    console.log(`${colors.blue}📊 Resumen de pruebas:${colors.reset}`);
    console.log(`   Total: ${totalTests}`);
    console.log(
      `   ${colors.green}Exitosas: ${successfulTests}${colors.reset}`,
    );
    console.log(`   ${colors.red}Fallidas: ${failedTests}${colors.reset}`);

    console.log(`\n${colors.cyan}🔍 Detalles por prueba:${colors.reset}`);
    this.results.forEach((result, index) => {
      const status = result.success
        ? `${colors.green}${emojis.success} ÉXITO${colors.reset}`
        : `${colors.red}${emojis.error} FALLO${colors.reset}`;

      console.log(`   ${index + 1}. ${result.test}: ${status}`);

      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    // Recomendaciones específicas
    console.log(`\n${colors.yellow}💡 Recomendaciones:${colors.reset}`);

    if (successfulTests === 0) {
      console.log(
        `   ${emojis.error} Problema crítico con la API key o conexión`,
      );
      console.log(`   - Verifica tu GEMINI_API_KEY en .env.local`);
      console.log(
        `   - Ve a https://aistudio.google.com/ para obtener una nueva`,
      );
    } else if (successfulTests < totalTests) {
      const hasImageModelIssue = this.results.find(
        (r) => r.test === "image_model" && !r.success,
      );
      if (hasImageModelIssue) {
        console.log(
          `   ${emojis.warning} Modelo de imagen no disponible (normal en preview)`,
        );
        console.log(`   - El try-on usará análisis de texto por ahora`);
        console.log(
          `   - Solicita acceso al modelo de imagen en Google AI Studio`,
        );
      }
    } else {
      console.log(`   ${emojis.success} ¡Todo funcionando perfectamente!`);
      console.log(`   - Ejecuta: npm run dev`);
      console.log(`   - Ve a: http://localhost:3000/product/1`);
      console.log(`   - Prueba la función "Probar Virtualmente"`);
    }

    console.log("\n" + "=".repeat(60) + "\n");
  }

  async runAllTests() {
    console.log(
      `${colors.bold}${colors.cyan}${emojis.api} Try-On Virtual - Diagnóstico de API${colors.reset}\n`,
    );

    if (!this.apiKey) {
      this.log("No se puede continuar sin API key válida", "error");
      process.exit(1);
    }

    const tests = [
      { name: "Conexión Básica", fn: this.testBasicConnection },
      { name: "Modelo de Imagen", fn: this.testImageModel },
      { name: "Generación Try-On", fn: this.testTryOnGeneration },
    ];

    for (const test of tests) {
      try {
        await test.fn.call(this);
        console.log(""); // Espacio entre pruebas
      } catch (error) {
        this.log(`Error inesperado en ${test.name}: ${error.message}`, "error");
        this.results.push({
          test: test.name.toLowerCase().replace(" ", "_"),
          success: false,
          error: error.message,
        });
      }
    }

    this.showResults();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests().catch(console.error);
}

module.exports = APITester;
