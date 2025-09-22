/**
 * Script de prueba para la nueva implementación de try-on
 * Prueba la funcionalidad completa usando @google/genai
 */

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function testNewTryOn() {
  console.log('🧪 Probando nueva implementación de try-on con @google/genai\n');

  try {
    // Verificar API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada en .env.local');
    }
    console.log('✅ API Key encontrada');

    // Importar función try-on
    const { tryOn, analyzeUserPhoto } = await import('../src/actions/try-on.ts');
    console.log('✅ Módulo try-on importado correctamente');

    // Crear imagen de prueba simple
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    // Crear archivo de prueba simulado
    const mockFile = {
      name: 'test-user-photo.png',
      type: 'image/png',
      size: testImageBuffer.length,
      arrayBuffer: async () => testImageBuffer.buffer,
      stream: () => {},
      text: async () => '',
      slice: () => mockFile
    };

    console.log('✅ Archivo de prueba creado');

    // Test 1: Análisis de foto del usuario
    console.log('\n🔍 Test 1: Análisis de foto del usuario');
    try {
      const formData1 = new FormData();
      // Simular FormData
      const mockFormData1 = {
        get: (key) => key === 'photo' ? mockFile : null
      };

      const analysisResult = await analyzeUserPhoto(mockFormData1);

      if (analysisResult.success) {
        console.log('✅ Análisis exitoso');
        console.log(`📝 Descripción: ${analysisResult.description?.substring(0, 100)}...`);
      } else {
        console.log(`⚠️ Análisis falló: ${analysisResult.error}`);
      }
    } catch (error) {
      console.log(`❌ Error en análisis: ${error.message}`);
    }

    // Test 2: Try-on completo
    console.log('\n👕 Test 2: Try-on completo');
    try {
      const mockFormData2 = {
        get: (key) => {
          if (key === 'productId') return '1';
          if (key === 'photo') return mockFile;
          return null;
        }
      };

      console.log('⏳ Ejecutando try-on...');
      const tryOnResult = await tryOn(mockFormData2);

      if (tryOnResult.success) {
        console.log('✅ Try-on exitoso!');
        console.log(`🖼️ Resultado: ${tryOnResult.result}`);

        // Verificar si es una ruta de archivo
        if (tryOnResult.result.startsWith('/downloads/')) {
          const fullPath = path.join(process.cwd(), 'public', tryOnResult.result);
          if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            console.log(`📊 Archivo generado: ${(stats.size / 1024).toFixed(2)} KB`);
            console.log(`🌐 URL: http://localhost:3002${tryOnResult.result}`);
          } else {
            console.log('⚠️ Archivo no encontrado en el sistema');
          }
        } else {
          console.log(`📏 Datos base64: ${tryOnResult.result.length} caracteres`);
        }
      } else {
        console.log(`❌ Try-on falló: ${tryOnResult.error}`);
      }
    } catch (error) {
      console.log(`❌ Error en try-on: ${error.message}`);
      console.log(`📋 Stack: ${error.stack?.split('\n')[1]}`);
    }

    // Test 3: Verificar archivos en downloads
    console.log('\n📁 Test 3: Verificar archivos en downloads');
    const downloadsPath = path.join(process.cwd(), 'public', 'downloads');

    if (fs.existsSync(downloadsPath)) {
      const files = fs.readdirSync(downloadsPath);
      console.log(`✅ Directorio downloads existe`);
      console.log(`📄 Archivos encontrados: ${files.length}`);

      files.forEach(file => {
        const filePath = path.join(downloadsPath, file);
        const stats = fs.statSync(filePath);
        console.log(`   - ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
      });

      if (files.length > 2) { // Más que solo error.png y error.svg
        console.log('🎉 Se generaron nuevas imágenes!');
      }
    } else {
      console.log('❌ Directorio downloads no existe');
    }

    console.log('\n✨ Prueba completada');

  } catch (error) {
    console.error('\n💥 Error crítico en la prueba:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Stack: ${error.stack?.split('\n')[0]}`);

    console.log('\n🔧 Posibles soluciones:');
    console.log('   • Verifica GEMINI_API_KEY en .env.local');
    console.log('   • Ejecuta: npm install @google/genai canvas');
    console.log('   • Asegúrate de que el servidor Next.js no esté corriendo');
    console.log('   • Verifica permisos de escritura en public/downloads');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testNewTryOn()
    .then(() => {
      console.log('\n🏁 Test completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💀 Fallo crítico:', error.message);
      process.exit(1);
    });
}

module.exports = { testNewTryOn };
