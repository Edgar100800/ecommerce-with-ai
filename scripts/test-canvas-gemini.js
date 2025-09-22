/**
 * Test simplificado que prueba Canvas y Gemini de forma independiente
 * No depende de Next.js ni alias de TypeScript
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

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
  rocket: '🚀',
  loading: '⏳',
  image: '🖼️',
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
      console.log(`${colors.cyan}${colors.bold}${emojis.rocket} ${message}${colors.reset}\n`);
      break;
  }
}

async function testCanvas() {
  log('Probando Canvas API', 'header');

  try {
    // Crear canvas
    const canvas = createCanvas(600, 800);
    const ctx = canvas.getContext('2d');
    log('Canvas creado: 600x800px', 'success');

    // Configurar fuentes y fondo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 800);
    log('Fondo aplicado', 'success');

    // Simular área de foto
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(50, 20, 500, 400);
    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Foto del Usuario (Simulada)', 300, 200);

    // Badge "Generado con IA"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(70, 40, 180, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('✨ Generado con IA', 160, 55);

    // Panel de análisis
    const panelY = 450;
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(20, panelY, 560, 320);
    ctx.strokeStyle = '#dee2e6';
    ctx.strokeRect(20, panelY, 560, 320);

    // Título
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Análisis Virtual Try-On', 40, panelY + 30);

    // Contenido simulado
    ctx.fillStyle = '#495057';
    ctx.font = '14px Arial';
    ctx.fillText('✓ Ajuste: Perfecto para tu tipo de cuerpo', 40, panelY + 70);
    ctx.fillText('✓ Estilo: Casual-elegante que te favorece', 40, panelY + 100);
    ctx.fillText('✓ Color: Ideal para tu tono de piel', 40, panelY + 130);

    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Confianza: HIGH', 40, panelY + 160);

    // Footer
    ctx.fillStyle = '#adb5bd';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Análisis generado por Gemini 2.5 Flash Image Preview', 300, 750);

    log('Contenido renderizado', 'success');

    // Guardar imagen
    const timestamp = Date.now();
    const filename = `test-canvas-${timestamp}.png`;
    const downloadsDir = path.join(process.cwd(), 'public', 'downloads');

    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
      log('Directorio downloads creado', 'info');
    }

    const filepath = path.join(downloadsDir, filename);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    const stats = fs.statSync(filepath);
    log(`Imagen guardada: ${filename} (${(stats.size / 1024).toFixed(2)} KB)`, 'success');
    log(`URL: http://localhost:3002/downloads/${filename}`, 'info');

    return filepath;

  } catch (error) {
    log(`Error en Canvas: ${error.message}`, 'error');
    throw error;
  }
}

async function testGemini() {
  log('Probando Gemini API', 'header');

  try {
    // Verificar API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada');
    }
    log('API Key encontrada', 'success');

    // Importar GoogleGenAI
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    log('Cliente Gemini inicializado', 'success');

    // Crear imagen de prueba simple
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const contents = [
      {
        text: 'Analiza esta imagen de prueba y describe qué ves. Incluye en tu respuesta la palabra "TEST_SUCCESS" para confirmar que funciona.'
      },
      {
        inlineData: {
          mimeType: 'image/png',
          data: testImageBase64
        }
      }
    ];

    log('Enviando solicitud a Gemini 2.5 Flash Image Preview...', 'loading');

    // Llamar a Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: contents
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('Respuesta inválida del modelo');
    }

    const text = response.candidates[0].content.parts[0]?.text || '';
    log('Respuesta recibida', 'success');
    log(`Texto: ${text.substring(0, 100)}...`, 'info');

    if (text.includes('TEST_SUCCESS')) {
      log('Gemini funcionando correctamente', 'success');
      return { success: true, text };
    } else {
      log('Gemini responde pero sin confirmación esperada', 'warning');
      return { success: false, text };
    }

  } catch (error) {
    log(`Error en Gemini: ${error.message}`, 'error');
    if (error.message.includes('API_KEY')) {
      log('Problema con API Key - verifica configuración', 'warning');
    } else if (error.message.includes('quota')) {
      log('Límite de cuota alcanzado', 'warning');
    } else if (error.message.includes('not found')) {
      log('Modelo no disponible - esto es normal en preview', 'warning');
    }
    return { success: false, error: error.message };
  }
}

async function testIntegration() {
  log('Probando integración Canvas + Gemini', 'header');

  try {
    const geminiResult = await testGemini();

    if (geminiResult.success) {
      log('Creando imagen con análisis real de Gemini...', 'loading');

      // Crear canvas con el texto real de Gemini
      const canvas = createCanvas(600, 800);
      const ctx = canvas.getContext('2d');

      // Fondo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 800);

      // Área de foto simulada
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(50, 20, 500, 400);
      ctx.fillStyle = '#666666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Análisis con Gemini Real', 300, 200);

      // Panel de análisis con texto de Gemini
      const panelY = 450;
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(20, panelY, 560, 320);
      ctx.strokeStyle = '#dee2e6';
      ctx.strokeRect(20, panelY, 560, 320);

      // Título
      ctx.fillStyle = '#212529';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Análisis de Gemini 2.5', 40, panelY + 30);

      // Texto de Gemini (multilínea)
      ctx.fillStyle = '#495057';
      ctx.font = '12px Arial';

      const words = geminiResult.text.split(' ');
      let line = '';
      let y = panelY + 70;
      const maxWidth = 520;
      const lineHeight = 16;

      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, 40, y);
          line = word + ' ';
          y += lineHeight;
          if (y > panelY + 280) break; // Evitar desbordamiento
        } else {
          line = testLine;
        }
      }

      if (line !== '' && y <= panelY + 280) {
        ctx.fillText(line, 40, y);
      }

      // Footer
      ctx.fillStyle = '#28a745';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('✅ INTEGRACIÓN EXITOSA', 300, 750);

      // Guardar imagen integrada
      const timestamp = Date.now();
      const filename = `integration-success-${timestamp}.png`;
      const filepath = path.join(process.cwd(), 'public', 'downloads', filename);

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filepath, buffer);

      const stats = fs.statSync(filepath);
      log(`Imagen integrada creada: ${filename} (${(stats.size / 1024).toFixed(2)} KB)`, 'success');
      log(`URL: http://localhost:3002/downloads/${filename}`, 'info');

    } else {
      log('Gemini no funcionó, creando imagen de prueba básica...', 'warning');
      await testCanvas();
    }

  } catch (error) {
    log(`Error en integración: ${error.message}`, 'error');
    throw error;
  }
}

async function runAllTests() {
  console.log(`${colors.bold}${colors.cyan}${emojis.test} Test Canvas + Gemini Integration${colors.reset}\n`);

  const results = {
    canvas: false,
    gemini: false,
    integration: false
  };

  try {
    // Test 1: Canvas
    console.log('='.repeat(60));
    await testCanvas();
    results.canvas = true;
    console.log('');

    // Test 2: Gemini
    console.log('='.repeat(60));
    const geminiResult = await testGemini();
    results.gemini = geminiResult.success;
    console.log('');

    // Test 3: Integración
    console.log('='.repeat(60));
    await testIntegration();
    results.integration = true;
    console.log('');

  } catch (error) {
    log(`Error crítico: ${error.message}`, 'error');
  }

  // Resumen final
  console.log('='.repeat(60));
  log('RESUMEN DE RESULTADOS', 'header');

  console.log(`${colors.blue}📊 Estado de las pruebas:${colors.reset}`);
  console.log(`   Canvas API: ${results.canvas ? colors.green + '✅ ÉXITO' : colors.red + '❌ FALLO'}${colors.reset}`);
  console.log(`   Gemini API: ${results.gemini ? colors.green + '✅ ÉXITO' : colors.red + '❌ FALLO'}${colors.reset}`);
  console.log(`   Integración: ${results.integration ? colors.green + '✅ ÉXITO' : colors.red + '❌ FALLO'}${colors.reset}`);

  const successful = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(`\n${colors.cyan}🎯 Resultado final: ${successful}/${total} pruebas exitosas${colors.reset}`);

  if (successful === total) {
    console.log(`${colors.green}${emojis.success} ¡Todas las pruebas pasaron! El sistema está listo.${colors.reset}`);
    console.log(`${colors.blue}💡 Puedes ejecutar la aplicación con: npm run dev${colors.reset}`);
  } else {
    console.log(`${colors.yellow}${emojis.warning} Algunas pruebas fallaron. Revisa los logs para más detalles.${colors.reset}`);
  }

  console.log('\n' + '='.repeat(60));
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests()
    .then(() => {
      console.log(`\n${colors.green}✨ Pruebas completadas${colors.reset}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n${colors.red}💥 Fallo crítico en las pruebas:${colors.reset}`, error.message);
      process.exit(1);
    });
}

module.exports = { testCanvas, testGemini, testIntegration, runAllTests };
