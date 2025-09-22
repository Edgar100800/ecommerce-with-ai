#!/usr/bin/env node

/**
 * Script de validación de configuración para Try-On Virtual
 * Basado en SETUP_GEMINI_API.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Emojis para mejor UX
const emojis = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: '🔧',
  rocket: '🚀',
  check: '🧪',
  key: '🔑',
  image: '🖼️',
  gear: '⚙️'
};

class SetupValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.projectRoot = process.cwd();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}]`;

    switch (type) {
      case 'success':
        console.log(`${colors.green}${emojis.success} ${prefix} ${message}${colors.reset}`);
        break;
      case 'error':
        console.log(`${colors.red}${emojis.error} ${prefix} ${message}${colors.reset}`);
        this.errors.push(message);
        break;
      case 'warning':
        console.log(`${colors.yellow}${emojis.warning} ${prefix} ${message}${colors.reset}`);
        this.warnings.push(message);
        break;
      case 'info':
        console.log(`${colors.blue}${emojis.info} ${prefix} ${message}${colors.reset}`);
        this.info.push(message);
        break;
      case 'header':
        console.log(`${colors.cyan}${colors.bold}${emojis.rocket} ${message}${colors.reset}\n`);
        break;
    }
  }

  // 1. Verificar variables de entorno
  validateEnvironment() {
    this.log('Validando Variables de Entorno', 'header');

    const envPath = path.join(this.projectRoot, '.env.local');

    if (!fs.existsSync(envPath)) {
      this.log('Archivo .env.local no encontrado', 'error');
      this.log('Crea el archivo .env.local con: GEMINI_API_KEY=tu_api_key', 'info');
      return false;
    }

    this.log('Archivo .env.local encontrado', 'success');

    // Leer y validar contenido
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasGeminiKey = envContent.includes('GEMINI_API_KEY');
    const hasAppUrl = envContent.includes('NEXT_PUBLIC_APP_URL');

    if (!hasGeminiKey) {
      this.log('GEMINI_API_KEY no encontrada en .env.local', 'error');
      return false;
    }

    // Extraer API key para validación básica
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (!apiKeyMatch || apiKeyMatch[1].trim() === 'tu_api_key_aqui') {
      this.log('GEMINI_API_KEY no configurada correctamente', 'error');
      this.log('Reemplaza "tu_api_key_aqui" con tu API key real de Google AI Studio', 'info');
      return false;
    }

    this.log('GEMINI_API_KEY configurada', 'success');

    if (!hasAppUrl) {
      this.log('NEXT_PUBLIC_APP_URL no encontrada, usando valor por defecto', 'warning');
    } else {
      this.log('NEXT_PUBLIC_APP_URL configurada', 'success');
    }

    return true;
  }

  // 2. Verificar dependencias
  validateDependencies() {
    this.log('Validando Dependencias', 'header');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      this.log('package.json no encontrado', 'error');
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Verificar dependencias críticas
    const requiredDeps = {
      '@google/generative-ai': 'Google Generative AI SDK',
      'next': 'Next.js Framework',
      'zod': 'Validación de esquemas',
      'server-only': 'Server-only utilities'
    };

    let allDepsValid = true;

    Object.entries(requiredDeps).forEach(([dep, description]) => {
      if (deps[dep]) {
        this.log(`${description}: v${deps[dep]}`, 'success');
      } else {
        this.log(`${description} no encontrada`, 'error');
        allDepsValid = false;
      }
    });

    return allDepsValid;
  }

  // 3. Verificar archivos de productos
  validateProductImages() {
    this.log('Validando Imágenes de Productos', 'header');

    const productsDir = path.join(this.projectRoot, 'public', 'products');
    if (!fs.existsSync(productsDir)) {
      this.log('Directorio public/products no encontrado', 'error');
      return false;
    }

    // Verificar archivos específicos mencionados en el setup
    const requiredImages = [
      'camiseta-blanca-1.jpg',
      'jeans-slim-1.svg',
      'sudadera-capucha-1.svg'
    ];

    let validImages = 0;

    requiredImages.forEach(imageName => {
      const imagePath = path.join(productsDir, imageName);
      if (fs.existsSync(imagePath)) {
        const stats = fs.statSync(imagePath);
        this.log(`${imageName}: ${(stats.size / 1024).toFixed(2)} KB`, 'success');
        validImages++;
      } else {
        this.log(`${imageName} no encontrada`, 'warning');
      }
    });

    this.log(`${validImages}/${requiredImages.length} imágenes de productos encontradas`, 'info');
    return validImages > 0;
  }

  // 4. Verificar estructura de archivos críticos
  validateFileStructure() {
    this.log('Validando Estructura de Archivos', 'header');

    const criticalFiles = [
      'src/lib/googleClient.ts',
      'src/actions/try-on.ts',
      'src/components/TryOnResult.tsx',
      'src/types/index.ts'
    ];

    let validFiles = 0;

    criticalFiles.forEach(filePath => {
      const fullPath = path.join(this.projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        this.log(`${filePath}`, 'success');
        validFiles++;

        // Verificar contenido crítico
        const content = fs.readFileSync(fullPath, 'utf8');

        if (filePath.includes('googleClient.ts')) {
          if (content.includes('gemini-2.5-flash-image-preview')) {
            this.log('  → Modelo correcto configurado', 'success');
          } else {
            this.log('  → Modelo gemini-2.5-flash-image-preview no encontrado', 'warning');
          }

          if (content.includes('responseMimeType')) {
            this.log('  → Configuración de salida de imagen presente', 'success');
          }
        }

        if (filePath.includes('try-on.ts')) {
          if (content.includes('TryOnSchema')) {
            this.log('  → Validación Zod presente', 'success');
          }
        }
      } else {
        this.log(`${filePath} no encontrado`, 'error');
      }
    });

    return validFiles === criticalFiles.length;
  }

  // 5. Verificar configuración TypeScript
  validateTypeScript() {
    this.log('Validando Configuración TypeScript', 'header');

    try {
      execSync('npm run type-check', {
        stdio: 'pipe',
        cwd: this.projectRoot
      });
      this.log('Type check exitoso', 'success');
      return true;
    } catch (error) {
      this.log('Errores de TypeScript encontrados', 'error');
      this.log('Ejecuta: npm run type-check para ver detalles', 'info');
      return false;
    }
  }

  // 6. Verificar que el servidor puede iniciarse
  validateServerStart() {
    this.log('Validando Configuración del Servidor', 'header');

    try {
      // Solo verificar que next build no falle
      execSync('npx next build --dry-run', {
        stdio: 'pipe',
        cwd: this.projectRoot
      });
      this.log('Configuración de Next.js válida', 'success');
      return true;
    } catch (error) {
      this.log('Problemas con configuración de Next.js', 'warning');
      this.log('El servidor podría tener problemas al iniciar', 'info');
      return false;
    }
  }

  // Mostrar resumen final
  showSummary() {
    console.log('\n' + '='.repeat(60));
    this.log('RESUMEN DE VALIDACIÓN', 'header');

    if (this.errors.length === 0) {
      this.log('¡Configuración completamente válida!', 'success');
      this.log('El sistema Try-On Virtual está listo para usar', 'info');
      console.log(`\n${colors.cyan}${emojis.rocket} Próximos pasos:${colors.reset}`);
      console.log(`   1. npm run dev`);
      console.log(`   2. Ir a http://localhost:3000/product/1`);
      console.log(`   3. Probar "Probar Virtualmente"`);
      console.log(`   4. O usar /diagnostic para pruebas\n`);
    } else {
      this.log(`${this.errors.length} errores encontrados`, 'error');
      console.log(`\n${colors.red}${emojis.error} Errores que debes corregir:${colors.reset}`);
      this.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n${colors.yellow}${emojis.warning} Advertencias (opcionales):${colors.reset}`);
      this.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }

  // Ejecutar todas las validaciones
  async runAll() {
    console.log(`${colors.bold}${colors.cyan}${emojis.check} Try-On Virtual - Validador de Configuración${colors.reset}\n`);

    const validations = [
      { name: 'Variables de Entorno', fn: this.validateEnvironment },
      { name: 'Dependencias', fn: this.validateDependencies },
      { name: 'Imágenes de Productos', fn: this.validateProductImages },
      { name: 'Estructura de Archivos', fn: this.validateFileStructure },
      { name: 'TypeScript', fn: this.validateTypeScript },
      { name: 'Servidor', fn: this.validateServerStart }
    ];

    const results = [];

    for (const validation of validations) {
      try {
        const result = await validation.fn.call(this);
        results.push(result);
      } catch (error) {
        this.log(`Error en validación ${validation.name}: ${error.message}`, 'error');
        results.push(false);
      }
    }

    this.showSummary();

    // Código de salida
    const hasErrors = this.errors.length > 0;
    process.exit(hasErrors ? 1 : 0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const validator = new SetupValidator();
  validator.runAll().catch(console.error);
}

module.exports = SetupValidator;
