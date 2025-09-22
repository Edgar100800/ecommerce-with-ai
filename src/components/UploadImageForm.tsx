"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { tryOn } from "@/actions/try-on";
import { TryOnResponse } from "@/types";

interface UploadImageFormProps {
  productId: string;
  productName: string;
  productImage: string;
  onResult: (result: TryOnResponse) => void;
  onClose: () => void;
}

export function UploadImageForm({
  productId,
  productName,
  productImage,
  onResult,
  onClose,
}: UploadImageFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validaciones
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setError("Por favor selecciona una imagen válida (JPG, PNG o WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB");
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Por favor selecciona una imagen primero");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("productId", productId);

    startTransition(async () => {
      try {
        const result = await tryOn(formData);
        onResult(result);
      } catch (error) {
        console.error("Error en tryOn:", error);
        onResult({
          success: false,
          error: "Error interno del servidor",
        });
      }
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];
      // Simular el evento de cambio
      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Prueba Virtual
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isPending}
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
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover rounded-lg"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">Vas a probar:</p>
                <p className="font-medium text-gray-900 truncate">
                  {productName}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visual comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 border-2 border-blue-200">
                  <Image
                    src={productImage}
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">
                      Prenda a probar
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                {previewUrl ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2 border-2 border-green-200">
                    <Image
                      src={previewUrl}
                      alt="Tu foto"
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium">Tu foto</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-2">
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">Sube tu foto</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload area */}
            <div
              role="button"
              tabIndex={0}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isPending}
              />

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
                    <svg
                      className="w-5 h-5"
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
                    <span className="text-sm font-medium">
                      ¡Imagen lista para la prueba virtual!
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      📸 {selectedFile?.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {selectedFile &&
                        (selectedFile.size / (1024 * 1024)).toFixed(1)}{" "}
                      MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      disabled={isPending}
                    >
                      🔄 Cambiar imagen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Sube tu foto
                    </p>
                    <p className="text-xs text-gray-500">
                      Arrastra y suelta o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, WebP (máx. 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Process explanation */}
            {selectedFile && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <h3 className="text-sm font-medium text-blue-900">
                    🎯 ¡Listo para la magia de IA!
                  </h3>
                </div>
                <p className="text-xs text-blue-700 mb-2">
                  La IA combinará tu foto con la imagen de{" "}
                  <strong>{productName}</strong> para crear una prueba virtual
                  realista.
                </p>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <span>⚡ Tiempo estimado: ~15 segundos</span>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                💡 Consejos para mejores resultados:
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Usa una foto donde se vea claramente tu torso</li>
                <li>• Asegúrate de tener buena iluminación</li>
                <li>• Evita ropa muy similar a la que quieres probar</li>
                <li>• Mantén una pose natural y frontal</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isPending}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Probar la ropa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
