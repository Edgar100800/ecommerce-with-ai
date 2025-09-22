import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge de disponibilidad */}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Agotado
          </div>
        )}

        {/* Badge de categoría */}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {product.category}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>

            {/* Colores disponibles */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">
                  {product.colors.length} colores
                </span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: color === 'Blanco' ? '#ffffff' :
                                       color === 'Negro' ? '#000000' :
                                       color === 'Gris' ? '#6b7280' :
                                       color === 'Azul' ? '#3b82f6' :
                                       color === 'Azul Marino' ? '#1e3a8a' :
                                       color === 'Azul Claro' ? '#7dd3fc' :
                                       color === 'Rosa' ? '#ec4899' :
                                       color === 'Azul Oscuro' ? '#1e40af' :
                                       '#9ca3af'
                      }}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-500">
                {product.sizes.length} tallas
              </span>
            </div>
          </div>
        </div>

        {/* Indicador de stock */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-xs ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
            {product.inStock ? 'Disponible' : 'Sin stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}
