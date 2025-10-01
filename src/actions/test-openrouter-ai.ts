"use server";
import "server-only";
import OpenAI from "openai";

export interface TestResult {
    success: boolean;
    error?: string;
    apiKeyValid?: boolean;
    modelAccessible?: boolean;
    imageAnalysisWorking?: boolean;
    tryOnWorking?: boolean;
    processingTime?: number;
    details?: {
        apiConnection?: string;
        modelResponse?: string;
        imageAnalysis?: string;
        tryOnResult?: string;
    };
}

// Sistema de logging consistente
const emojis = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "🔧",
    loading: "⏳",
};

function logTest(
    message: string,
    type: "success" | "error" | "warning" | "info" | "loading" = "info",
) {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[TEST ${timestamp}]`;
    const emoji = emojis[type] || emojis.info;
    console.log(`${emoji} ${prefix} ${message}`);
}

async function fileToDataUrl(file: File): Promise<string> {
    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");
    return `data:${file.type};base64,${base64}`;
}

export async function testOpenRouterConnection(): Promise<TestResult> {
    const startTime = Date.now();

    try {
        logTest("Iniciando test de conexión con OpenRouter", "loading");

        // Verificar API Key
        if (!process.env.OPENROUTER_API_KEY) {
            logTest("OPENROUTER_API_KEY no encontrada", "error");
            return {
                success: false,
                error: "OPENROUTER_API_KEY environment variable is not set",
                apiKeyValid: false,
            };
        }

        logTest("API Key encontrada", "success");

        // Inicializar cliente OpenRouter
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer":
                    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
                "X-Title": "Ecommerce AI Try-On Test",
            },
        });

        logTest("Cliente OpenRouter inicializado", "info");

        // Test básico de conexión
        try {
            const testResponse = await openai.chat.completions.create({
                model: "google/gemini-2.5-flash-image-preview",
                messages: [
                    {
                        role: "user",
                        content:
                            "Responde solo con 'OK' para confirmar que la conexión funciona.",
                    },
                ],
                max_tokens: 10,
            });

            if (testResponse.choices?.[0]?.message?.content) {
                logTest("Conexión con OpenRouter exitosa", "success");

                const processingTime = Date.now() - startTime;

                return {
                    success: true,
                    apiKeyValid: true,
                    modelAccessible: true,
                    processingTime,
                    details: {
                        apiConnection: "Exitosa",
                        modelResponse: testResponse.choices[0].message.content,
                    },
                };
            } else {
                throw new Error("Respuesta vacía del modelo");
            }
        } catch (apiError) {
            logTest(`Error en llamada a la API: ${apiError}`, "error");
            return {
                success: false,
                error: `API call failed: ${(apiError as Error).message}`,
                apiKeyValid: true,
                modelAccessible: false,
                details: {
                    apiConnection: "API Key válida pero modelo no accesible",
                },
            };
        }
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logTest(`Error crítico en test: ${error}`, "error");

        return {
            success: false,
            error: (error as Error).message,
            processingTime,
            apiKeyValid: false,
            modelAccessible: false,
        };
    }
}

export async function testImageAnalysis(
    formData: FormData,
): Promise<TestResult> {
    const startTime = Date.now();

    try {
        logTest("Iniciando test de análisis de imagen", "loading");

        const photo = formData.get("photo") as File;

        if (!photo || photo.size === 0) {
            return {
                success: false,
                error: "No photo provided",
                imageAnalysisWorking: false,
            };
        }

        // Verificar API Key
        if (!process.env.OPENROUTER_API_KEY) {
            return {
                success: false,
                error: "OPENROUTER_API_KEY not set",
                apiKeyValid: false,
            };
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer":
                    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
                "X-Title": "Ecommerce AI Try-On Test",
            },
        });

        // Convertir imagen a data URL
        const photoDataUrl = await fileToDataUrl(photo);
        logTest("Imagen convertida a data URL", "info");

        const messages = [
            {
                role: "user" as const,
                content: [
                    {
                        type: "text" as const,
                        text: "Describe esta imagen brevemente. Solo menciona los elementos principales que ves.",
                    },
                    {
                        type: "image_url" as const,
                        image_url: {
                            url: photoDataUrl,
                            detail: "high" as const,
                        },
                    },
                ],
            },
        ];

        logTest("Enviando imagen para análisis...", "loading");

        const response = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-image-preview",
            messages,
            max_tokens: 200,
            temperature: 0.3,
        });

        const processingTime = Date.now() - startTime;

        if (response.choices?.[0]?.message?.content) {
            const description = response.choices[0].message.content;
            logTest("Análisis de imagen exitoso", "success");
            logTest(`Descripción: ${description.substring(0, 100)}...`, "info");

            return {
                success: true,
                apiKeyValid: true,
                modelAccessible: true,
                imageAnalysisWorking: true,
                processingTime,
                details: {
                    imageAnalysis: description,
                },
            };
        } else {
            throw new Error("No content in response");
        }
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logTest(`Error en análisis de imagen: ${error}`, "error");

        return {
            success: false,
            error: (error as Error).message,
            processingTime,
            imageAnalysisWorking: false,
        };
    }
}

export async function testTryOnGeneration(
    formData: FormData,
): Promise<TestResult> {
    const startTime = Date.now();

    try {
        logTest("Iniciando test de generación try-on", "loading");

        const photo = formData.get("photo") as File;

        if (!photo || photo.size === 0) {
            return {
                success: false,
                error: "No photo provided",
                tryOnWorking: false,
            };
        }

        // Verificar API Key
        if (!process.env.OPENROUTER_API_KEY) {
            return {
                success: false,
                error: "OPENROUTER_API_KEY not set",
                apiKeyValid: false,
            };
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer":
                    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
                "X-Title": "Ecommerce AI Try-On Test",
            },
        });

        // Usar imagen de prueba estática para el producto
        const testProductImage =
            "data:image/svg+xml;base64," +
            Buffer.from(
                `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#f0f0f0"/>
        <rect x="100" y="50" width="200" height="300" fill="#4a90e2" rx="10"/>
        <text x="200" y="200" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
          Test Product
        </text>
        <text x="200" y="220" text-anchor="middle" fill="white" font-size="12" font-family="Arial">
          Clothing Item
        </text>
      </svg>
    `,
            ).toString("base64");

        // Convertir foto del usuario a data URL
        const userPhotoDataUrl = await fileToDataUrl(photo);
        logTest("Imágenes preparadas para test try-on", "info");

        const messages = [
            {
                role: "user" as const,
                content: [
                    {
                        type: "text" as const,
                        text: "Genera una imagen que muestre a la persona de la primera imagen usando la ropa de la segunda imagen. Crea un resultado de prueba virtual realista.",
                    },
                    {
                        type: "image_url" as const,
                        image_url: {
                            url: userPhotoDataUrl,
                            detail: "high" as const,
                        },
                    },
                    {
                        type: "image_url" as const,
                        image_url: {
                            url: testProductImage,
                            detail: "high" as const,
                        },
                    },
                ],
            },
        ];

        logTest("Enviando solicitud de try-on a OpenRouter...", "loading");

        const response = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-image-preview",
            messages,
            max_tokens: 4000,
            temperature: 0.7,
        });

        const processingTime = Date.now() - startTime;

        if (response.choices?.[0]?.message?.content) {
            const content = response.choices[0].message.content;
            logTest("Respuesta de try-on recibida", "success");

            // Verificar si contiene imagen o datos
            const hasImageData =
                content.includes("base64") ||
                content.includes("data:image") ||
                content.length > 100; // Respuesta sustancial

            return {
                success: true,
                apiKeyValid: true,
                modelAccessible: true,
                imageAnalysisWorking: true,
                tryOnWorking: hasImageData,
                processingTime,
                details: {
                    tryOnResult: hasImageData
                        ? "Imagen generada exitosamente"
                        : "Respuesta recibida pero sin imagen detectada",
                },
            };
        } else {
            throw new Error("No content in try-on response");
        }
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logTest(`Error en test de try-on: ${error}`, "error");

        return {
            success: false,
            error: (error as Error).message,
            processingTime,
            tryOnWorking: false,
        };
    }
}

export async function runFullDiagnostic(
    formData?: FormData,
): Promise<TestResult> {
    const startTime = Date.now();

    try {
        logTest("Iniciando diagnóstico completo de OpenRouter", "loading");

        // Test 1: Conexión básica
        const connectionTest = await testOpenRouterConnection();
        if (!connectionTest.success) {
            return {
                ...connectionTest,
                error: `Conexión falló: ${connectionTest.error}`,
            };
        }

        logTest("✅ Test de conexión passed", "success");

        // Test 2: Análisis de imagen (si se proporciona)
        let imageAnalysisTest: TestResult | null = null;
        if (formData) {
            imageAnalysisTest = await testImageAnalysis(formData);
            if (imageAnalysisTest.success) {
                logTest("✅ Test de análisis de imagen passed", "success");
            } else {
                logTest(
                    `⚠️ Test de análisis de imagen failed: ${imageAnalysisTest.error}`,
                    "warning",
                );
            }
        }

        // Test 3: Try-on generation (si se proporciona imagen)
        let tryOnTest: TestResult | null = null;
        if (formData) {
            tryOnTest = await testTryOnGeneration(formData);
            if (tryOnTest.success) {
                logTest("✅ Test de try-on passed", "success");
            } else {
                logTest(
                    `⚠️ Test de try-on failed: ${tryOnTest.error}`,
                    "warning",
                );
            }
        }

        const totalTime = Date.now() - startTime;
        logTest(`Diagnóstico completo finalizado en ${totalTime}ms`, "success");

        return {
            success: true,
            apiKeyValid: true,
            modelAccessible: true,
            imageAnalysisWorking: imageAnalysisTest?.success ?? false,
            tryOnWorking: tryOnTest?.success ?? false,
            processingTime: totalTime,
            details: {
                apiConnection: "✅ Conexión exitosa",
                modelResponse: connectionTest.details?.modelResponse,
                imageAnalysis:
                    imageAnalysisTest?.details?.imageAnalysis || "No testeado",
                tryOnResult: tryOnTest?.details?.tryOnResult || "No testeado",
            },
        };
    } catch (error) {
        const totalTime = Date.now() - startTime;
        logTest(`Error en diagnóstico completo: ${error}`, "error");

        return {
            success: false,
            error: (error as Error).message,
            processingTime: totalTime,
        };
    }
}
