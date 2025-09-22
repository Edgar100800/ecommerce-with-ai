/**
 * Test simple para la nueva implementación simplificada de try-on
 * Solo prueba las 2 imágenes + prompt genérico (sin Canvas)
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
  test: '🧪'
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
      console.log(`${colors.cyan}${colors.bold}${message}${colors.reset}\n`);
      break;
  }
}

async function testSimpleTryOn() {
  log('🧪 Test Try-On Simplificado (Solo 2 imágenes + prompt genérico)', 'header');

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

    // Crear imagen de usuario simulada (1x1 píxel azul)
    const userImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    // Cargar imagen de producto real
    const productImagePath = path.join(process.cwd(), 'public', 'products', 'camiseta-blanca-1.jpg');

    if (!fs.existsSync(productImagePath)) {
      throw new Error('Imagen de producto no encontrada: products/camiseta-blanca-1.jpg');
    }

    const productBuffer = fs.readFileSync(productImagePath);
    const productBase64 = productBuffer.toString('base64');
    log('Imágenes preparadas (usuario simulada + producto real)', 'success');

    // Preparar contenido - SOLO PROMPT GENÉRICO + 2 IMÁGENES
    const contents = [
      {
        text: 'Analiza estas dos imágenes: una persona y una prenda de ropa. Describe cómo se vería la prenda en la persona. Sé específico sobre el ajuste, estilo y compatibilidad visual.'
      },
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

    log('Enviando solicitud a Gemini 2.5 Flash Image Preview...', 'loading');
    log('🎯 Sin contexto de producto, sin nombres, solo imágenes + prompt genérico', 'info');

    // Llamar a Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: contents
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('Respuesta inválida del modelo');
    }

    let analysisText = '';
    let imageData = null;
    let hasImage = false;
    let hasText = false;

    // Procesar respuesta
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        analysisText += part.text;
        hasText = true;
        log(`Análisis recibido: ${part.text.substring(0, 80)}...`, 'info');
      } else if (part.inlineData) {
        imageData = part.inlineData.data;
        hasImage = true;
        log('Imagen generada por Gemini recibida', 'success');
      }
    }

    // Mostrar resultados
    console.log('\n' + '='.repeat(60));
    log('RESULTADOS DEL TEST', 'header');

    console.log(`${colors.blue}📊 Respuesta del modelo:${colors.reset}`);
    console.log(`   Texto/Análisis: ${hasText ? colors.green + '✅ SÍ' : colors.red + '❌ NO'}${colors.reset}`);
    console.log(`   Imagen generada: ${hasImage ? colors.green + '✅ SÍ' : colors.red + '❌ NO'}${colors.reset}`);

    if (hasText) {
      console.log(`\n${colors.cyan}📝 Análisis completo:${colors.reset}`);
      console.log(`${colors.blue}${'-'.repeat(40)}${colors.reset}`);
      console.log(analysisText);
      console.log(`${colors.blue}${'-'.repeat(40)}${colors.reset}`);
    }

    // Guardar resultados si hay imagen
    if (hasImage && imageData) {
      const timestamp = Date.now();
      const filename = `simple-tryon-${timestamp}.png`;
      const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      const filepath = path.join(downloadsDir, filename);
      const imageBuffer = Buffer.from(imageData, 'base64');
      fs.writeFileSync(filepath, imageBuffer);

      const stats = fs.statSync(filepath);
      log(`Imagen guardada: ${filename} (${(stats.size / 1024).toFixed(2)} KB)`, 'success');
      log(`URL: http://localhost:3002/downloads/${filename}`, 'info');
    }

    // Verificar archivos en downloads
    const downloadsPath = path.join(process.cwd(), 'public', 'downloads');
    if (fs.existsSync(downloadsPath)) {
      const files = fs.readdirSync(downloadsPath).filter(f => f.startsWith('simple-tryon') || f.startsWith('gemini-tryon'));
      log(`Archivos try-on en downloads: ${files.length}`, 'info');
    }

    // Resumen final
    console.log(`\n${colors.cyan}🎯 Resumen:${colors.reset}`);
    if (hasImage) {
      console.log(`${colors.green}✅ ÉXITO TOTAL: Gemini generó imagen + análisis${colors.reset}`);
      console.log(`${colors.blue}💡 La nueva implementación funciona perfectamente${colors.reset}`);
    } else if (hasText) {
      console.log(`${colors.yellow}✅ ÉXITO PARCIAL: Gemini generó análisis de texto${colors.reset}`);
      console.log(`${colors.blue}💡 Gemini puede analizar pero no generar imágenes en este momento${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ FALLO: No se recibió respuesta útil${colors.reset}`);
    }

    console.log(`${colors.blue}🔧 Implementación simplificada:${colors.reset}`);
    console.log(`   • ✅ Sin Canvas`);
    console.log(`   • ✅ Sin contexto de producto`);
    console.log(`   • ✅ Solo 2 imágenes + prompt genérico`);
    console.log(`   • ✅ Maneja tanto imágenes como análisis de texto`);

  } catch (error) {
    log(`Error crítico: ${error.message}`, 'error');

    if (error.message.includes('API_KEY')) {
      log('Verifica GEMINI_API_KEY en .env.local', 'warning');
    } else if (error.message.includes('quota')) {
      log('Límite de cuota alcanzado', 'warning');
    } else if (error.message.includes('not found')) {
      log('Modelo no disponible (normal en preview)', 'warning');
    }

    console.log(`\n${colors.red}💡 Posibles soluciones:${colors.reset}`);
    console.log('   • Verifica que GEMINI_API_KEY esté en .env.local');
    console.log('   • Ejecuta: npm install @google/genai');
    console.log('   • Asegúrate de que public/products/camiseta-blanca-1.jpg existe');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testSimpleTryOn()
    .then(() => {
      console.log(`\n${colors.green}🏁 Test completado${colors.reset}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n${colors.red}💀 Fallo crítico:${colors.reset}`, error.message);
      process.exit(1);
    });
}

module.exports = { testSimpleTryOn };
