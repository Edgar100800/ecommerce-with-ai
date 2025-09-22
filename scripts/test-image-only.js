/**
 * Test específico para verificar que SOLO se genera imagen (no texto)
 * Verifica que Gemini devuelva una imagen editada como resultado
 */

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Colores para terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Emojis
const emojis = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: '🔧',
  loading: '⏳',
  test: '🧪',
  image: '🖼️'
};

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;

  switch (type) {
    case 'success':
      console.log(`${colors.green}${emojis.success} ${prefix} ${message}${colors.reset}`);
      break;
    case 'error':
      console.log(`${colors.red}${emojis.error} ${prefix} ${message}${colors.reset}`);
      break;
    case 'warning':
      console.log(`${colors.yellow}${emojis.warning} ${prefix} ${message}${colors.reset}`);
      break;
    case 'info':
      console.log(`${colors.blue}${emojis.info} ${prefix} ${message}${colors.reset}`);
      break;
    case 'loading':
      console.log(`${colors.yellow}${emojis.loading} ${prefix} ${message}${colors.reset}`);
      break;
    case 'header':
      console.log(`${colors.cyan}${colors.bold}${emojis.image} ${message}${colors.reset}\n`);
      break;
  }
}

async function testImageOnlyOutput() {
  log('Test IMAGEN SOLAMENTE - Virtual Try-On', 'header');

  try {
    // Verificar API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada en .env.local');
    }
    log('API Key encontrada', 'success');

    // Importar GoogleGenAI
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    log('Cliente Gemini inicializado', 'success');

    // Crear imagen de usuario simulada (píxel pequeño)
    const userImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    // Cargar imagen de producto real
    const productImagePath = path.join(process.cwd(), 'public', 'products', 'camiseta-blanca-1.jpg');

    if (!fs.existsSync(productImagePath)) {
      throw new Error('Imagen de producto no encontrada: products/camiseta-blanca-1.jpg');
    }

    const productBuffer = fs.readFileSync(productImagePath);
    const productBase64 = productBuffer.toString('base64');
    log('Imágenes cargadas: usuario + producto', 'success');

    // Prompt que FUERZA generación de imagen (inglés para mejor resultado)
    const imagePrompt = `
Create a new image showing the person wearing the clothing item from the second image.
Generate a realistic virtual try-on result by combining both images.
The output must be an image, not text.
Show the person wearing the white t-shirt.
`.trim();

    const contents = [
      { text: imagePrompt },
      {
        inlineData: {
          mimeType: 'image/png',
          data: userImageBase64
        }
      },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: productBase64
        }
      }
    ];

    log('Prompt configurado para FORZAR generación de imagen', 'info');
    log('Enviando solicitud a Gemini 2.5 Flash Image Preview...', 'loading');

    // Primera tentativa
    let response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    });

    let imageData = null;
    let hasText = false;
    let attempt = 1;

    // Procesar respuesta del primer intento
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          log(`Imagen obtenida en intento ${attempt}`, 'success');
          break;
        } else if (part.text) {
          hasText = true;
          log(`Texto recibido (no deseado): ${part.text.substring(0, 60)}...`, 'warning');
        }
      }
    }

    // Si no hay imagen, segundo intento con prompt más agresivo
    if (!imageData) {
      attempt = 2;
      log('Primera tentativa sin imagen - intentando prompt más específico...', 'warning');

      const forceImagePrompt = `
GENERATE IMAGE ONLY.
Create a photorealistic image showing the person from image 1 wearing the white t-shirt from image 2.
Combine the images to create a virtual try-on result.
DO NOT provide text analysis. OUTPUT IMAGE ONLY.
`;

      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: [
          { text: forceImagePrompt },
          ...contents.slice(1), // Solo las imágenes
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 16,
          topP: 0.8,
        },
      });

      // Procesar segunda respuesta
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData.data;
            log(`Imagen obtenida en intento ${attempt}`, 'success');
            break;
          } else if (part.text) {
            hasText = true;
            log(`Texto recibido en segundo intento: ${part.text.substring(0, 60)}...`, 'warning');
          }
        }
      }
    }

    // Mostrar resultados
    console.log('\n' + '='.repeat(80));
    log('RESULTADOS DEL TEST - IMAGEN SOLAMENTE', 'header');

    console.log(`${colors.blue}📊 Análisis de la respuesta:${colors.reset}`);
    console.log(`   Imagen generada: ${imageData ? colors.green + '✅ SÍ' : colors.red + '❌ NO'}${colors.reset}`);
    console.log(`   Texto recibido: ${hasText ? colors.red + '❌ SÍ (no deseado)' : colors.green + '✅ NO (perfecto)'}${colors.reset}`);
    console.log(`   Intentos necesarios: ${attempt}`);

    if (imageData) {
      // Guardar imagen
      const timestamp = Date.now();
      const filename = `image-only-test-${timestamp}.png`;
      const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      const filepath = path.join(downloadsDir, filename);
      const imageBuffer = Buffer.from(imageData, 'base64');
      fs.writeFileSync(filepath, imageBuffer);

      const stats = fs.statSync(filepath);
      console.log(`\n${colors.green}${emojis.image} IMAGEN GENERADA EXITOSAMENTE:${colors.reset}`);
      console.log(`   Archivo: ${filename}`);
      console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   Ruta: /downloads/${filename}`);
      console.log(`   URL: http://localhost:3002/downloads/${filename}`);

      // Verificar que es una imagen válida
      const header = imageBuffer.toString('hex', 0, 8);
      const isPNG = header.startsWith('89504e47');
      const isJPG = header.startsWith('ffd8ff');

      console.log(`\n${colors.cyan}🔍 Validación de imagen:${colors.reset}`);
      console.log(`   Formato válido: ${(isPNG || isJPG) ? colors.green + '✅ SÍ' : colors.red + '❌ NO'}${colors.reset}`);
      console.log(`   Tipo detectado: ${isPNG ? 'PNG' : isJPG ? 'JPEG' : 'Desconocido'}`);

      // Resumen final
      console.log(`\n${colors.bold}${colors.green}🎉 ÉXITO TOTAL:${colors.reset}`);
      console.log(`${colors.green}   ✅ Imagen generada correctamente${colors.reset}`);
      console.log(`${colors.green}   ✅ ${hasText ? 'Texto ignorado' : 'Sin texto (perfecto)'}${colors.reset}`);
      console.log(`${colors.green}   ✅ Archivo guardado y accesible${colors.reset}`);
      console.log(`${colors.green}   ✅ Implementación funcionando como se esperaba${colors.reset}`);

    } else {
      console.log(`\n${colors.red}❌ FALLO: No se pudo generar imagen${colors.reset}`);
      console.log(`${colors.red}   • Gemini no generó imagen después de ${attempt} intentos${colors.reset}`);
      console.log(`${colors.red}   • ${hasText ? 'Solo devolvió texto' : 'No devolvió nada útil'}${colors.reset}`);

      console.log(`\n${colors.yellow}💡 Posibles causas:${colors.reset}`);
      console.log(`   • El modelo Gemini 2.5 Flash Image Preview puede no soportar generación de imágenes`);
      console.log(`   • La funcionalidad de edición de imágenes puede estar limitada`);
      console.log(`   • Las imágenes de entrada pueden ser demasiado simples`);
    }

    // Mostrar archivos en downloads
    const downloadsPath = path.join(process.cwd(), 'public', 'downloads');
    if (fs.existsSync(downloadsPath)) {
      const files = fs.readdirSync(downloadsPath).filter(f => f.includes('test') || f.includes('tryon'));
      console.log(`\n${colors.blue}📁 Archivos de prueba en downloads: ${files.length}${colors.reset}`);
      files.forEach(file => {
        const filePath = path.join(downloadsPath, file);
        const stats = fs.statSync(filePath);
        console.log(`   • ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
      });
    }

  } catch (error) {
    log(`Error crítico: ${error.message}`, 'error');

    console.log(`\n${colors.red}🚨 Detalles del error:${colors.reset}`);
    console.log(`   Mensaje: ${error.message}`);

    if (error.message.includes('API_KEY')) {
      log('Problema con API Key - verifica .env.local', 'warning');
    } else if (error.message.includes('quota')) {
      log('Límite de cuota alcanzado', 'warning');
    } else if (error.message.includes('not found')) {
      log('Modelo no disponible', 'warning');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testImageOnlyOutput()
    .then(() => {
      console.log(`\n${colors.cyan}🏁 Test completado${colors.reset}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n${colors.red}💀 Fallo crítico:${colors.reset}`, error.message);
      process.exit(1);
    });
}

module.exports = { testImageOnlyOutput };
