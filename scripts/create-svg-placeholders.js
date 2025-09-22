const fs = require('fs');
const path = require('path');

// Crear directorio si no existe
const productsDir = path.join(__dirname, '..', 'public', 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// Función para crear SVG placeholder
function createSVGPlaceholder(text, bgColor, textColor, width = 800, height = 800) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <defs>
            <style>
                .text { font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; }
            </style>
        </defs>
        <text x="50%" y="45%" text-anchor="middle" class="text" fill="${textColor}">${text}</text>
        <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16px" fill="${textColor}">800 x 800</text>
    </svg>`;
}

// Lista de productos y configuraciones SVG
const products = [
    // Camiseta Blanca
    { name: 'camiseta-blanca-1.jpg', text: 'Camiseta Blanca', bg: '#f8f9fa', color: '#6c757d' },
    { name: 'camiseta-blanca-2.jpg', text: 'Vista Lateral', bg: '#ffffff', color: '#495057' },
    { name: 'camiseta-blanca-3.jpg', text: 'Vista Trasera', bg: '#f1f3f4', color: '#6c757d' },

    // Jeans Slim
    { name: 'jeans-slim-1.jpg', text: 'Jeans Slim Fit', bg: '#1e40af', color: '#ffffff' },
    { name: 'jeans-slim-2.jpg', text: 'Vista Lateral', bg: '#1d4ed8', color: '#ffffff' },
    { name: 'jeans-slim-3.jpg', text: 'Detalle', bg: '#2563eb', color: '#ffffff' },

    // Sudadera con Capucha
    { name: 'sudadera-capucha-1.jpg', text: 'Sudadera Capucha', bg: '#6b7280', color: '#ffffff' },
    { name: 'sudadera-capucha-2.jpg', text: 'Con Capucha', bg: '#374151', color: '#ffffff' },
    { name: 'sudadera-capucha-3.jpg', text: 'Vista Trasera', bg: '#1f2937', color: '#ffffff' },

    // Chaqueta Denim
    { name: 'chaqueta-denim-1.jpg', text: 'Chaqueta Denim', bg: '#3b82f6', color: '#ffffff' },
    { name: 'chaqueta-denim-2.jpg', text: 'Vista Abierta', bg: '#2563eb', color: '#ffffff' },
    { name: 'chaqueta-denim-3.jpg', text: 'Detalle Bolsillo', bg: '#1d4ed8', color: '#ffffff' },

    // Vestido Casual
    { name: 'vestido-casual-1.jpg', text: 'Vestido Casual', bg: '#ec4899', color: '#ffffff' },
    { name: 'vestido-casual-2.jpg', text: 'Vista Completa', bg: '#db2777', color: '#ffffff' },
    { name: 'vestido-casual-3.jpg', text: 'Detalle Tela', bg: '#be185d', color: '#ffffff' },

    // Camisa Formal
    { name: 'camisa-formal-1.jpg', text: 'Camisa Formal', bg: '#ffffff', color: '#1f2937' },
    { name: 'camisa-formal-2.jpg', text: 'Azul Claro', bg: '#dbeafe', color: '#1e40af' },
    { name: 'camisa-formal-3.jpg', text: 'Rosa Claro', bg: '#fce7f3', color: '#be185d' },

    // Shorts Deportivos
    { name: 'shorts-deportivos-1.jpg', text: 'Shorts Deportivos', bg: '#111827', color: '#ffffff' },
    { name: 'shorts-deportivos-2.jpg', text: 'Gris Deportivo', bg: '#6b7280', color: '#ffffff' },
    { name: 'shorts-deportivos-3.jpg', text: 'Azul Deportivo', bg: '#3b82f6', color: '#ffffff' },

    // Blazer Elegante
    { name: 'blazer-elegante-1.jpg', text: 'Blazer Elegante', bg: '#111827', color: '#ffffff' },
    { name: 'blazer-elegante-2.jpg', text: 'Azul Marino', bg: '#1e3a8a', color: '#ffffff' },
    { name: 'blazer-elegante-3.jpg', text: 'Gris Elegante', bg: '#6b7280', color: '#ffffff' }
];

console.log('🚀 Creando placeholders SVG...\n');

// Crear archivos SVG
products.forEach((product, index) => {
    const svgContent = createSVGPlaceholder(product.text, product.bg, product.color);
    const filepath = path.join(productsDir, product.name);

    // Cambiar extensión a .svg temporalmente
    const svgPath = filepath.replace('.jpg', '.svg');

    try {
        fs.writeFileSync(svgPath, svgContent);
        console.log(`✅ Creado: ${product.name.replace('.jpg', '.svg')}`);
    } catch (error) {
        console.error(`❌ Error creando ${product.name}:`, error.message);
    }
});

console.log('\n✨ ¡Todos los placeholders SVG han sido creados!');
console.log(`📁 Ubicación: ${productsDir}`);
console.log('\n📝 Nota: Los archivos se crearon como .svg');
console.log('💡 Para usar imágenes reales, reemplaza estos archivos con fotos JPG/PNG de tus productos.');
console.log('\n🔄 Para convertir SVG a JPG/PNG, puedes usar herramientas como:');
console.log('   • https://convertio.co/svg-jpg/');
console.log('   • Photoshop, GIMP, o Figma');
console.log('   • Librerías como sharp en Node.js');

// Crear un archivo de instrucciones
const instructionsPath = path.join(productsDir, 'README-PLACEHOLDERS.md');
const instructions = `# Placeholders de Productos

## 📁 Archivos Creados

Los siguientes archivos SVG han sido creados como placeholders:

${products.map(p => `- ${p.name.replace('.jpg', '.svg')} - ${p.text}`).join('\n')}

## 🔄 Cómo Reemplazar con Imágenes Reales

1. **Encuentra fotos reales** de tus productos
2. **Renombra** las imágenes según la convención:
   - \`producto-nombre-1.jpg\` (imagen principal)
   - \`producto-nombre-2.jpg\` (vista lateral/alternativa)
   - \`producto-nombre-3.jpg\` (vista trasera/detalle)
3. **Reemplaza** los archivos SVG con las imágenes JPG/PNG
4. **Mantén** el tamaño recomendado: 800x800px o superior

## 📐 Especificaciones Recomendadas

- **Formato**: JPG, PNG, o WebP
- **Tamaño**: Mínimo 800x800px
- **Aspecto**: Cuadrado (1:1)
- **Calidad**: Alta resolución para zoom
- **Fondo**: Preferiblemente blanco o neutral

## 🎯 Consejos para Mejores Resultados

- Usa buena iluminación
- Fondo limpio y uniforme
- Múltiples ángulos del producto
- Detalles de texturas y características especiales
- Consistencia en el estilo fotográfico

## 🔗 Herramientas Útiles

- **Conversión SVG**: https://convertio.co/svg-jpg/
- **Edición**: Photoshop, GIMP, Canva
- **Compresión**: TinyPNG, ImageOptim
- **Generación**: Unsplash, Pexels (fotos stock)
`;

fs.writeFileSync(instructionsPath, instructions);
console.log(`📋 Instrucciones creadas: ${path.basename(instructionsPath)}`);
