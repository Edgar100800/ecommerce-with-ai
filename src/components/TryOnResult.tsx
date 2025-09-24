"use client";

import { useState } from "react";
import Image from "next/image";
import type { TryOnResponse } from "@/types";

interface TryOnResultProps {
  result: TryOnResponse;
  productName: string;
  onClose: () => void;
  onTryAgain: () => void;
}

export function TryOnResult({
  result,
  productName,
  onClose,
  onTryAgain,
}: TryOnResultProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = () => {
    if (!result.success || !result.result) return;

    // Crear enlace de descarga directo
    const link = document.createElement("a");
    link.href = result.result;
    const filename = `try-on-${productName}-${Date.now()}.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función helper para convertir data URL a blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleShare = async () => {
    if (!result.success || !result.result) return;

    try {
      let blob: Blob;

      // Verificar si es data URL o URL normal
      if (result.result.startsWith("data:")) {
        blob = dataURLtoBlob(result.result);
      } else {
        // Obtener imagen desde la ruta
        const response = await fetch(result.result);
        blob = await response.blob();
      }

      const file = new File([blob], `try-on-${productName}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Probando ${productName}`,
          text: `¡Mira cómo me queda ${productName}!`,
          files: [file],
        });
      } else {
        // Fallback: copiar al clipboard si está disponible
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        alert("Imagen copiada al portapapeles");
      }
    } catch (error) {
      console.error("Error al compartir:", error);
      alert("No se pudo compartir la imagen");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Resultado de Prueba Virtual
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar ventana"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Producto info */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Probaste:</p>
            <p className="font-medium text-gray-900">{productName}</p>
          </div>

          {result.success && result.result ? (
            <div className="space-y-6">
              {/* Imagen resultado */}
              <div className="relative">
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={result.result}
                    alt={`Prueba virtual de ${productName}`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />

                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>

                {/* Overlay con información */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                  <p className="text-xs font-medium">✨ Generado con IA</p>
                </div>
              </div>

              {/* Success message */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-800">
                      ¡Prueba completada!
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Tu imagen con {productName} ha sido generada exitosamente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Descargar
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Compartir
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onTryAgain}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Probar otra vez
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cerrar
                </button>
              </div>

              {/* Tips */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  💡 ¿Te gusta el resultado?
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Guarda la imagen para mostrarla a tus amigos</li>
                  <li>• Prueba diferentes poses para mejores resultados</li>
                  <li>• Explora otros productos de nuestra colección</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Error state */
            <div className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Error en la prueba virtual
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {result.error ||
                        "No se pudo generar la imagen. Inténtalo de nuevo."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-900 mb-2">
                  🔧 Posibles soluciones:
                </h3>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>
                    • Asegúrate de que la imagen sea clara y bien iluminada
                  </li>
                  <li>• Usa una foto donde se vea claramente tu torso</li>
                  <li>• Verifica que el archivo sea JPG, PNG o WebP</li>
                  <li>• Intenta con una imagen de menor tamaño</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onTryAgain}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Intentar de nuevo
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
