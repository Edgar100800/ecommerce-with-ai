import { GoogleAIDiagnostic } from "@/components/GoogleAIDiagnostic";
import Link from "next/link";

export default function DiagnosticPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Diagnóstico de OpenRouter AI
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Verifica la configuración y funcionalidad de la
                                integración con OpenRouter + Gemini 2.5 Flash
                                Image Preview
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            ← Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8">
                <GoogleAIDiagnostic />
            </div>

            {/* Footer Info */}
            <div className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                🔧 ¿Qué hace este diagnóstico?
                            </h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>
                                    • Verifica que tu API Key de OpenRouter sea
                                    válida
                                </p>
                                <p>
                                    • Prueba la conectividad con los servicios
                                    de OpenRouter
                                </p>
                                <p>
                                    • Evalúa la capacidad de análisis de
                                    imágenes con Gemini 2.5 Flash
                                </p>
                                <p>
                                    • Prueba el proceso de try-on virtual con
                                    generación de imágenes
                                </p>
                                <p>
                                    • Proporciona recomendaciones de
                                    configuración
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                🚀 Estado Actual de Nanobanana
                            </h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p>
                                        <strong>⚠️ Nota Importante:</strong> El
                                        modelo nanobanana de Google aún no está
                                        disponible públicamente. El sistema
                                        actual usa Gemini 1.5 Flash para
                                        análisis de imágenes y simula el proceso
                                        de try-on.
                                    </p>
                                </div>
                                <p>
                                    Cuando nanobanana esté disponible, se
                                    integrará automáticamente sin cambios en el
                                    código de tu parte.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                            📚 Recursos Útiles
                        </h4>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p>
                                •{" "}
                                <a
                                    href="https://openrouter.ai/docs"
                                    className="underline hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Documentación oficial de OpenRouter
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
                                    Modelo Gemini 2.5 Flash Image Preview
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const metadata = {
    title: "Diagnóstico OpenRouter AI - Ecommerce Images",
    description:
        "Herramienta de diagnóstico para verificar la configuración de OpenRouter + Gemini 2.5 Flash Image Preview y la funcionalidad de try-on virtual",
};
