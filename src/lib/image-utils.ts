// Utilidad para manejar rutas de imágenes de productos
// Soporta automáticamente PNG y JPG

export interface ImageConfig {
  baseName: string;
  extensions: string[];
  fallbackExtension: string;
}

// Configuración por defecto
// const DEFAULT_CONFIG: ImageConfig = {
//   baseName: '',
//   extensions: ['.jpg', '.jpeg', '.png', '.webp'],
//   fallbackExtension: '.jpg'
// };

/**
 * Genera las rutas de imágenes para un producto
 * Intenta encontrar la extensión correcta automáticamente
 */
export function getProductImages(
  baseName: string,
  count: number = 3,
): string[] {
  const images: string[] = [];

  for (let i = 1; i <= count; i++) {
    const imagePath = `/products/${baseName}-${i}`;

    // Por ahora retornamos con extensión por defecto
    // En el futuro se puede implementar detección automática
    images.push(`${imagePath}.jpg`);
  }

  return images;
}

/**
 * Mapeo de nombres de productos a sus nombres base de archivo
 */
export const PRODUCT_IMAGE_MAP = {
  "camiseta-blanca": "camiseta-blanca",
  "jeans-slim": "jeans-slim",
  "sudadera-capucha": "sudadera-capucha",
  "chaqueta-denim": "chaqueta-denim",
  "vestido-casual": "vestido-casual",
  "camisa-formal": "camisa-formal",
  "shorts-deportivos": "shorts-deportivos",
  "blazer-elegante": "blazer-elegante",
} as const;

/**
 * Obtiene las rutas de imagen para un producto específico
 */
export function getProductImagesByName(
  productName: keyof typeof PRODUCT_IMAGE_MAP,
): string[] {
  const baseName = PRODUCT_IMAGE_MAP[productName];
  return getProductImages(baseName);
}

/**
 * Obtiene la imagen de fallback si la principal no existe
 */
export function getFallbackImage(baseName: string): string {
  return `/products/placeholder-${baseName}.svg`;
}

/**
 * Genera una imagen placeholder SVG inline para casos de emergencia
 */
export function generatePlaceholderSVG(
  text: string,
  width: number = 800,
  height: number = 800,
): string {
  const bgColor = "#f1f5f9";
  const textColor = "#64748b";

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${textColor}">
        ${text}
      </text>
    </svg>
  `)}`;
}

/**
 * Utilidades para optimización de imágenes
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 200 },
  card: { width: 400, height: 400 },
  gallery: { width: 800, height: 800 },
  fullscreen: { width: 1200, height: 1200 },
} as const;

/**
 * Genera srcSet para imágenes responsivas
 */
export function generateSrcSet(basePath: string): string {
  return [`${basePath} 1x`, `${basePath} 2x`].join(", ");
}

/**
 * Obtiene el tamaño de imagen recomendado según el contexto
 */
export function getImageSizes(
  context: "card" | "gallery" | "thumbnail" | "hero",
): string {
  const sizeMap = {
    card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
    gallery: "(max-width: 768px) 100vw, 50vw",
    thumbnail: "100px",
    hero: "(max-width: 768px) 100vw, 80vw",
  };

  return sizeMap[context];
}

/**
 * Convierte nombre de producto a slug para URL
 */
export function productNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Convierte slug a nombre base de imagen
 */
export function slugToImageBase(slug: string): string {
  // Mapeo específico para nuestros productos
  const slugMap: Record<string, string> = {
    "camiseta-clasica-blanca": "camiseta-blanca",
    "jeans-slim-fit": "jeans-slim",
    "sudadera-con-capucha": "sudadera-capucha",
    "chaqueta-denim": "chaqueta-denim",
    "vestido-casual": "vestido-casual",
    "camisa-formal": "camisa-formal",
    "shorts-deportivos": "shorts-deportivos",
    "blazer-elegante": "blazer-elegante",
  };

  return slugMap[slug] || slug;
}

/**
 * Valida que un archivo sea una imagen válida
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return validTypes.includes(file.type);
}

/**
 * Valida el tamaño de una imagen
 */
export function isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Obtiene información de una imagen
 */
export function getImageInfo(file: File): {
  name: string;
  size: number;
  type: string;
  sizeFormatted: string;
} {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeFormatted: formatSize(file.size),
  };
}
