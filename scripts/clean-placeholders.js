const fs = require('fs');
const path = require('path');

// Directorio de productos
const productsDir = path.join(__dirname, '..', 'public', 'products');

console.log('🧹 Limpiando placeholders SVG...\n');

try {
    // Verificar que el directorio existe
    if (!fs.existsSync(productsDir)) {
        console.log('❌ Error: La carpeta public/products no existe');
        process.exit(1);
    }

    // Leer archivos en el directorio
    const files = fs.readdirSync(productsDir);

    // Filtrar solo archivos SVG
    const svgFiles = files.filter(file => file.endsWith('.svg'));

    if (svgFiles.length === 0) {
        console.log('✨ No hay archivos SVG para eliminar. ¡Todo limpio!');
    } else {
        console.log(`📂 Encontrados ${svgFiles.length} archivos SVG para eliminar:\n`);

        // Mostrar lista de archivos que se van a eliminar
        svgFiles.forEach(file => {
            console.log(`   🗑️  ${file}`);
        });

        console.log('\n❓ ¿Proceder con la eliminación? (s/N)');

        // Leer input del usuario
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', function(key) {
            // Ctrl+C para salir
            if (key === '\u0003') {
                console.log('\n👋 Operación cancelada');
                process.exit();
            }

            const input = key.toString().toLowerCase();

            if (input === 's' || input === 'y') {
                console.log('\n🗑️  Eliminando archivos SVG...\n');

                let deletedCount = 0;

                svgFiles.forEach(file => {
                    try {
                        const filePath = path.join(productsDir, file);
                        fs.unlinkSync(filePath);
                        console.log(`✅ Eliminado: ${file}`);
                        deletedCount++;
                    } catch (error) {
                        console.log(`❌ Error eliminando ${file}: ${error.message}`);
                    }
                });

                console.log(`\n✨ ¡Limpieza completada! ${deletedCount} archivos eliminados.`);
                console.log('\n📋 Próximos pasos:');
                console.log('1. Copia tus imágenes PNG/JPG a public/products/');
                console.log('2. Usa los nombres exactos de IMAGENES_GUIA.md');
                console.log('3. Reinicia el servidor: npm run dev');
                console.log('\n💡 Tip: Lee IMAGENES_GUIA.md para la lista completa de nombres requeridos');

                process.exit(0);
            } else {
                console.log('\n❌ Operación cancelada');
                process.exit(0);
            }
        });
    }

} catch (error) {
    console.error('❌ Error ejecutando el script:', error.message);
    process.exit(1);
}

// Función de ayuda si se ejecuta sin confirmar
setTimeout(() => {
    if (process.stdin.isTTY) {
        console.log('\n⏰ Tiempo agotado. Ejecuta de nuevo para continuar.');
        process.exit(0);
    }
}, 30000); // 30 segundos timeout
