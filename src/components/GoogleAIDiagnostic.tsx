"use client";

import { useState } from "react";
import {
    testOpenRouterConnection,
    testImageAnalysis,
    testTryOnGeneration,
    runFullDiagnostic,
    TestResult,
} from "@/actions/test-openrouter-ai";

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

    const runConnectionTest = async () => {
        setDiagnostic({ isRunning: true, result: null });

        try {
            const result = await testOpenRouterConnection();
            setDiagnostic({
                isRunning: false,
                result,
            });
        } catch (error) {
            setDiagnostic({
                isRunning: false,
                result: {
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Error desconocido",
                },
            });
        }
    };

    const runImageAnalysisTest = async () => {
        if (!testFile) {
            alert("Por favor selecciona una imagen para probar análisis");
            return;
        }

        setDiagnostic({ isRunning: true, result: null });

        try {
            const formData = new FormData();
            formData.append("photo", testFile);

            const result = await testImageAnalysis(formData);
            setDiagnostic({
                isRunning: false,
                result,
            });
        } catch (error) {
            setDiagnostic({
                isRunning: false,
                result: {
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Error desconocido",
                },
            });
        }
    };

    const runTryOnTest = async () => {
        if (!testFile) {
            alert("Por favor selecciona una imagen para probar try-on");
            return;
        }

        setDiagnostic({ isRunning: true, result: null });

        try {
            const formData = new FormData();
            formData.append("photo", testFile);
            formData.append("productId", "1"); // Usar producto de prueba

            const result = await testTryOnGeneration(formData);
            setDiagnostic({
                isRunning: false,
                result,
            });
        } catch (error) {
            setDiagnostic({
                isRunning: false,
                result: {
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Error desconocido",
                },
            });
        }
    };

    const runFullTest = async () => {
        setDiagnostic({ isRunning: true, result: null });

        try {
            const formData = testFile ? new FormData() : undefined;
            if (testFile && formData) {
                formData.append("photo", testFile);
                formData.append("productId", "1");
            }

            const result = await runFullDiagnostic(formData);
            setDiagnostic({
                isRunning: false,
                result,
            });
        } catch (error) {
            setDiagnostic({
                isRunning: false,
                result: {
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Error desconocido",
                },
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    🔧 Diagnóstico de OpenRouter AI
                    <span className="text-sm font-normal text-gray-500">
                        (Gemini 2.5 Flash Image Preview)
                    </span>
                </h2>

                {/* Estado del sistema */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h3 className="font-semibold text-gray-900">
                                OpenRouter + Gemini 2.5 Flash Image Preview
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Modelo de generación de imágenes de alta calidad con
                            entendimiento contextual
                        </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h3 className="font-semibold text-gray-900">
                                Estado del Servicio
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            API Key:{" "}
                            {process.env.OPENROUTER_API_KEY
                                ? "✅ Configurada"
                                : "❌ No configurada"}
                        </p>
                    </div>
                </div>

                {/* Selección de archivo para tests */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen para pruebas (opcional para algunos tests):
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setTestFile(e.target.files?.[0] || null)
                        }
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {testFile && (
                        <p className="text-sm text-gray-600 mt-1">
                            Archivo seleccionado: {testFile.name} (
                            {(testFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    )}
                </div>

                {/* Botones de test */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={runConnectionTest}
                        disabled={diagnostic.isRunning}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        {diagnostic.isRunning
                            ? "⏳ Probando..."
                            : "🔌 Test Conexión"}
                    </button>

                    <button
                        onClick={runImageAnalysisTest}
                        disabled={diagnostic.isRunning || !testFile}
                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        {diagnostic.isRunning
                            ? "⏳ Analizando..."
                            : "🔍 Test Análisis"}
                    </button>

                    <button
                        onClick={runTryOnTest}
                        disabled={diagnostic.isRunning || !testFile}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        {diagnostic.isRunning
                            ? "⏳ Generando..."
                            : "👔 Test Try-On"}
                    </button>

                    <button
                        onClick={runFullTest}
                        disabled={diagnostic.isRunning}
                        className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        {diagnostic.isRunning
                            ? "⏳ Ejecutando..."
                            : "🚀 Test Completo"}
                    </button>
                </div>

                {/* Explicación de tests */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Tests Disponibles:
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div>
                            <strong>🔌 Test Conexión:</strong> Verifica
                            conectividad con OpenRouter API
                        </div>
                        <div>
                            <strong>🔍 Test Análisis:</strong> Prueba análisis
                            de imagen con Gemini 2.5 Flash
                        </div>
                        <div>
                            <strong>👔 Test Try-On:</strong> Prueba generación
                            de try-on virtual
                        </div>
                        <div>
                            <strong>🚀 Test Completo:</strong> Ejecuta todos los
                            tests secuencialmente
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                {diagnostic.result && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Resultados del Diagnóstico
                        </h3>

                        <div
                            className={`p-4 rounded-lg border ${
                                diagnostic.result.success
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">
                                    {diagnostic.result.success ? "✅" : "❌"}
                                </span>
                                <span className="font-semibold">
                                    {diagnostic.result.success
                                        ? "Diagnóstico Exitoso"
                                        : "Diagnóstico con Errores"}
                                </span>
                                {diagnostic.result.processingTime && (
                                    <span className="text-sm text-gray-600 ml-auto">
                                        {diagnostic.result.processingTime}ms
                                    </span>
                                )}
                            </div>

                            {/* Error message */}
                            {diagnostic.result.error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
                                    <strong>Error:</strong>{" "}
                                    {diagnostic.result.error}
                                </div>
                            )}

                            {/* Status checks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span>
                                            {diagnostic.result.apiKeyValid ===
                                            true
                                                ? "✅"
                                                : diagnostic.result
                                                        .apiKeyValid === false
                                                  ? "❌"
                                                  : "⏳"}
                                        </span>
                                        <span className="text-sm">
                                            API Key Válida
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>
                                            {diagnostic.result
                                                .modelAccessible === true
                                                ? "✅"
                                                : diagnostic.result
                                                        .modelAccessible ===
                                                    false
                                                  ? "❌"
                                                  : "⏳"}
                                        </span>
                                        <span className="text-sm">
                                            Modelo Accesible
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span>
                                            {diagnostic.result
                                                .imageAnalysisWorking === true
                                                ? "✅"
                                                : diagnostic.result
                                                        .imageAnalysisWorking ===
                                                    false
                                                  ? "❌"
                                                  : "⏳"}
                                        </span>
                                        <span className="text-sm">
                                            Análisis de Imagen
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>
                                            {diagnostic.result.tryOnWorking ===
                                            true
                                                ? "✅"
                                                : diagnostic.result
                                                        .tryOnWorking === false
                                                  ? "❌"
                                                  : "⏳"}
                                        </span>
                                        <span className="text-sm">
                                            Generación Try-On
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            {diagnostic.result.details && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">
                                        Detalles:
                                    </h4>

                                    {diagnostic.result.details
                                        .apiConnection && (
                                        <div className="bg-white p-3 rounded border">
                                            <strong>Conexión API:</strong>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {
                                                    diagnostic.result.details
                                                        .apiConnection
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {diagnostic.result.details
                                        .modelResponse && (
                                        <div className="bg-white p-3 rounded border">
                                            <strong>
                                                Respuesta del Modelo:
                                            </strong>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {
                                                    diagnostic.result.details
                                                        .modelResponse
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {diagnostic.result.details
                                        .imageAnalysis && (
                                        <div className="bg-white p-3 rounded border">
                                            <strong>Análisis de Imagen:</strong>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {
                                                    diagnostic.result.details
                                                        .imageAnalysis
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {diagnostic.result.details.tryOnResult && (
                                        <div className="bg-white p-3 rounded border">
                                            <strong>Resultado Try-On:</strong>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {
                                                    diagnostic.result.details
                                                        .tryOnResult
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pasos para solucionar problemas */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Pasos para solucionar problemas:
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div>
                            1. Verifica que tu OPENROUTER_API_KEY esté
                            configurada correctamente
                        </div>
                        <div>
                            2. Asegúrate de tener créditos suficientes en
                            OpenRouter
                        </div>
                        <div>
                            3. Verifica que el modelo
                            google/gemini-2.5-flash-image-preview esté
                            disponible
                        </div>
                        <div>
                            4. Verifica que se genere la imagen con Gemini 2.5
                            Flash Image Preview
                        </div>
                    </div>
                </div>

                {/* Enlaces útiles */}
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Enlaces útiles:
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p>
                            •{" "}
                            <a
                                href="https://openrouter.ai/docs"
                                className="underline hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Documentación de OpenRouter
                            </a>
                        </p>
                        <p>
                            •{" "}
                            <a
                                href="https://openrouter.ai/keys"
                                className="underline hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Obtener API Key de OpenRouter
                            </a>
                        </p>
                        <p>
                            •{" "}
                            <a
                                href="https://openrouter.ai/google/gemini-2.5-flash-image-preview"
                                className="underline hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Información del modelo Gemini 2.5 Flash Image
                                Preview
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
