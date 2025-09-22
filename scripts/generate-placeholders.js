const fs = require('fs');
const https = require('https');
const path = require('path');

// Crear directorio si no existe
const productsDir = path.join(__dirname, '..', 'public', 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// Lista de productos y sus imágenes placeholder
const placeholders = [
    // Camiseta Blanca
    { name: 'camiseta-blanca-1.jpg', url: 'https://via.placeholder.com/800x800/FFFFFF/CCCCCC?text=Camiseta+Blanca+1' },
    { name: 'camiseta-blanca-2.jpg', url: 'https://via.placeholder.com/800x800/F8F8F8/AAAAAA?text=Camiseta+Blanca+2' },
    { name: 'camiseta-blanca-3.jpg', url: 'https://via.placeholder.com/800x800/FAFAFA/999999?text=Camiseta+Blanca+3' },

    // Jeans Slim
    { name: 'jeans-slim-1.jpg', url: 'https://via.placeholder.com/800x800/1E3A8A/FFFFFF?text=Jeans+Slim+1' },
    { name: 'jeans-slim-2.jpg', url: 'https://via.placeholder.com/800x800/1E40AF/FFFFFF?text=Jeans+Slim+2' },
    { name: 'jeans-slim-3.jpg', url: 'https://via.placeholder.com/800x800/1D4ED8/FFFFFF?text=Jeans+Slim+3' },

    // Sudadera con Capucha
    { name: 'sudadera-capucha-1.jpg', url: 'https://via.placeholder.com/800x800/6B7280/FFFFFF?text=Sudadera+1' },
    { name: 'sudadera-capucha-2.jpg', url: 'https://via.placeholder.com/800x800/111827/FFFFFF?text=Sudadera+2' },
    { name: 'sudadera-capucha-3.jpg', url: 'https://via.placeholder.com/800x800/1E3A8A/FFFFFF?text=Sudadera+3' },

    // Chaqueta Denim
    { name: 'chaqueta-denim-1.jpg', url: 'https://via.placeholder.com/800x800/7DD3FC/000000?text=Chaqueta+Denim+1' },
    { name: 'chaqueta-denim-2.jpg', url: 'https://via.placeholder.com/800x800/1E40AF/FFFFFF?text=Chaqueta+Denim+2' },
    { name: 'chaqueta-denim-3.jpg', url: 'https://via.placeholder.com/800x800/0EA5E9/FFFFFF?text=Chaqueta+Denim+3' },

    // Vestido Casual
    { name: 'vestido-casual-1.jpg', url: 'https://via.placeholder.com/800x800/FFFFFF/EC4899?text=Vestido+Casual+1' },
    { name: 'vestido-casual-2.jpg', url: 'https://via.placeholder.com/800x800/EC4899/FFFFFF?text=Vestido+Casual+2' },
    { name: 'vestido-casual-3.jpg', url: 'https://via.placeholder.com/800x800/3B82F6/FFFFFF?text=Vestido+Casual+3' },

    // Camisa Formal
    { name: 'camisa-formal-1.jpg', url: 'https://via.placeholder.com/800x800/FFFFFF/1F2937?text=Camisa+Formal+1' },
    { name: 'camisa-formal-2.jpg', url: 'https://via.placeholder.com/800x800/7DD3FC/1F2937?text=Camisa+Formal+2' },
    { name: 'camisa-formal-3.jpg', url: 'https://via.placeholder.com/800x800/EC4899/FFFFFF?text=Camisa+Formal+3' },

    // Shorts Deportivos
    { name: 'shorts-deportivos-1.jpg', url: 'https://via.placeholder.com/800x800/111827/FFFFFF?text=Shorts+Deportivos+1' },
    { name: 'shorts-deportivos-2.jpg', url: 'https://via.placeholder.com/800x800/6B7280/FFFFFF?text=Shorts+Deportivos+2' },
    { name: 'shorts-deportivos-3.jpg', url: 'https://via.placeholder.com/800x800/3B82F6/FFFFFF?text=Shorts+Deportivos+3' },

    // Blazer Elegante
    { name: 'blazer-elegante-1.jpg', url: 'https://via.placeholder.com/800x800/111827/FFFFFF?text=Blazer+Elegante+1' },
    { name: 'blazer-elegante-2.jpg', url: 'https://via.placeholder.com/800x800/1E3A8A/FFFFFF?text=Blazer+Elegante+2' },
    { name: 'blazer-elegante-3.jpg', url: 'https://via.placeholder.com/800x800/6B7280/FFFFFF?text=Blazer+Elegante+3' }
];

// Función para descargar imagen
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`✅ Descargado: ${path.basename(filepath)}`);
                resolve();
            });

            file.on('error', (err) => {
                fs.unlink(filepath, () => {}); // Eliminar archivo parcial
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Función principal
async function generatePlaceholders() {
    console.log('🚀 Generando imágenes placeholder...\n');

    try {
        for (const placeholder of placeholders) {
            const filepath = path.join(productsDir, placeholder.name);

            // Verificar si la imagen ya existe
            if (fs.existsSync(filepath)) {
                console.log(`⏭️  Ya existe: ${placeholder.name}`);
                continue;
            }

            await downloadImage(placeholder.url, filepath);

            // Pausa pequeña para evitar sobrecargar el servicio
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n✨ ¡Todas las imágenes placeholder han sido generadas!');
        console.log(`📁 Ubicación: ${productsDir}`);
        console.log('\n💡 Tip: Reemplaza estas imágenes con fotos reales de tus productos para mejores resultados.');

    } catch (error) {
        console.error('❌ Error generando placeholders:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
generatePlaceholders();
