"use client";

import { useState } from "react";
import { testTryOnGeneration, TestResult } from "@/actions/test-google-ai";

interface DiagnosticState {
  isRunning: boolean;
  result: TestResult | null;
}

export function GoogleAIDiagnostic() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticState>({
    isRunning: false,
    result: null,
  });

  const [testFile, setTestFile] = useState<File | null>(null);

  const runTryOnTest = async () => {
    if (!testFile) {
      alert("Por favor selecciona una imagen para probar try-on");
      return;
    }

    setDiagnostic((prev) => ({ ...prev, isRunning: true }));

    try {
      const formData = new FormData();
      formData.append("photo", testFile);
      formData.append("productId", "1"); // Usar producto de prueba

      const tryOnResult = await testTryOnGeneration(formData);
      setDiagnostic({
        isRunning: false,
        result: tryOnResult,
      });
    } catch (error) {
      console.error("Error running try-on test:", error);
      setDiagnostic((prev) => ({ ...prev, isRunning: false }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
    }
  };

  const getStatusIcon = (success?: boolean) => {
    if (success === undefined) return "⚪";
    return success ? "✅" : "❌";
  };

  const getStatusColor = (success?: boolean) => {
    if (success === undefined) return "text-gray-500";
    return success ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🔧 Diagnóstico de Google AI
          <span className="text-sm font-normal text-gray-500">
            (Modo Desarrollo)
          </span>
        </h2>

        {/* Status Overview */}
        {/* Status Card */}
        <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-semibold text-gray-900">
                Gemini 2.5 Flash Image Preview
              </h3>
              <p className="text-sm text-gray-600">
                Try-On Virtual con Generación de Imágenes
              </p>
            </div>
          </div>
        </div>

        {/* Try-On Test Section */}
        <div className="space-y-4 mb-8">
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">
              Probar Try-On Virtual
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={runTryOnTest}
                disabled={!testFile || diagnostic.isRunning}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {diagnostic.isRunning ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <span>🎯</span>
                )}
                Probar Try-On
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {/* Results Display */}
        {diagnostic.result && (
          <div className="mt-6">
            <div
              className={`p-4 rounded-lg border ${diagnostic.result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{getStatusIcon(diagnostic.result.success)}</span>
                <h4 className="font-semibold">
                  Try-On con Gemini 2.5 Flash Image Preview
                </h4>
              </div>
              <p
                className={`text-sm ${getStatusColor(diagnostic.result.success)}`}
              >
                {diagnostic.result.message}
              </p>

              {diagnostic.result.details.error && (
                <div className="mt-2 p-2 bg-red-100 rounded text-red-700">
                  <strong>Error:</strong> {diagnostic.result.details.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Configuration Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            ℹ️ Información de Configuración
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            <div>
              <strong>Modelo Actual:</strong> Gemini 1.5 Flash (Análisis y
              generación de contenido)
            </div>
            <div>
              <strong>Nanobanana:</strong> No disponible públicamente (usando
              simulación)
            </div>
            <div>
              <strong>Try-On Mode:</strong> Desarrollo - retorna imagen original
              con análisis
            </div>
            <div className="mt-2 p-2 bg-blue-100 rounded">
              <strong>Nota:</strong> Cuando nanobanana esté disponible, se
              integrará automáticamente. Por ahora, el sistema analiza las
              imágenes y simula el proceso de try-on.
            </div>
          </div>
        </div>

        {/* Instructions */}
        {/* Setup Instructions */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">
            🔧 Configuración para Try-On Virtual
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            <div>
              1. Configura tu{" "}
              <code className="bg-gray-200 px-1 rounded">GEMINI_API_KEY</code>{" "}
              en .env.local
            </div>
            <div>2. Sube una foto clara (JPG/PNG, máximo 5MB)</div>
            <div>3. Ejecuta la prueba de try-on</div>
            <div>
              4. Verifica que se genere la imagen con Gemini 2.5 Flash Image
              Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
