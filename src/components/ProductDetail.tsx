"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, TryOnResponse } from "@/types";
import { UploadImageForm } from "./UploadImageForm";
import { TryOnResult } from "./TryOnResult";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<TryOnResponse | null>(null);

  const handleTryOnResult = (result: TryOnResponse) => {
    setShowUploadForm(false);
    setTryOnResult(result);
  };

  const handleTryAgain = () => {
    setTryOnResult(null);
    setShowUploadForm(true);
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      Blanco: "#ffffff",
      Negro: "#000000",
      Gris: "#6b7280",
      Azul: "#3b82f6",
      "Azul Marino": "#1e3a8a",
      "Azul Claro": "#7dd3fc",
      "Azul Oscuro": "#1e40af",
      Rosa: "#ec4899",
    };
    return colorMap[color] || "#9ca3af";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          {/* Imagen principal */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Agotado</p>
                </div>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} vista ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className={`text-xs ${product.inStock ? "text-green-700" : "text-red-700"}`}
                >
                  {product.inStock ? "Disponible" : "Sin stock"}
                </span>
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Selección de color */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Color:{" "}
                {selectedColor && (
                  <span className="text-gray-600">{selectedColor}</span>
                )}
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: getColorStyle(color) }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <div className="absolute inset-1 rounded-full border border-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selección de talla */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Talla:{" "}
                {selectedSize && (
                  <span className="text-gray-600">{selectedSize}</span>
                )}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Cantidad</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                disabled={!product.inStock}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                disabled={!product.inStock}
              >
                +
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-4">
            {/* Prueba virtual */}
            <button
              onClick={() => setShowUploadForm(true)}
              disabled={!product.inStock}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              ✨ Probar la ropa
            </button>

            {/* Agregar al carrito */}
            <button
              disabled={!product.inStock}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5M7 13v6a1 1 0 001 1h9a1 1 0 001-1v-6M9 21v-8a1 1 0 011-1h4a1 1 0 011 1v8"
                />
              </svg>
              {product.inStock ? "Agregar al carrito" : "Sin stock"}
            </button>
          </div>

          {/* Información adicional */}
          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Envío gratis en compras superiores a $50
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Garantía de satisfacción de 30 días
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Prueba virtual con IA avanzada
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showUploadForm && (
        <UploadImageForm
          productId={product.id}
          productName={product.name}
          productImage={product.images[selectedImage]}
          onResult={handleTryOnResult}
          onClose={() => setShowUploadForm(false)}
        />
      )}

      {tryOnResult && (
        <TryOnResult
          result={tryOnResult}
          productName={product.name}
          onClose={() => setTryOnResult(null)}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  );
}
