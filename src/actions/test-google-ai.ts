"use server";
import "server-only";
import { googleClient } from "@/lib/googleClient";

export interface TestResult {
  success: boolean;
  message: string;
  details: {
    apiKeyValid: boolean;
    modelAvailable: boolean;
    canAnalyzeImages: boolean;
    canGenerateContent: boolean;
    error?: string;
  };
}

export async function testTryOnGeneration(
  formData: FormData,
): Promise<TestResult> {
  try {
    const photo = formData.get("photo") as File;
    const productId = formData.get("productId") as string;

    if (!photo || photo.size === 0) {
      return {
        success: false,
        message: "Foto del usuario requerida para try-on",
        details: {
          apiKeyValid: true,
          modelAvailable: true,
          canAnalyzeImages: true,
          canGenerateContent: false,
          error: "Foto del usuario requerida",
        },
      };
    }

    if (!productId) {
      return {
        success: false,
        message: "ID de producto requerido para try-on",
        details: {
          apiKeyValid: true,
          modelAvailable: true,
          canAnalyzeImages: true,
          canGenerateContent: false,
          error: "Product ID requerido",
        },
      };
    }

    // Probar generación try-on real con Gemini 2.5 Flash Image Preview
    const testResult = await googleClient.generateTryOnImage({
      userPhoto: photo,
      productImage: "/products/camiseta-blanca-1.jpg",
      prompt: "Prueba de generación try-on con Gemini 2.5 Flash Image Preview",
    });

    if (!testResult.success) {
      return {
        success: false,
        message: "Error en la generación try-on",
        details: {
          apiKeyValid: true,
          modelAvailable: true,
          canAnalyzeImages: true,
          canGenerateContent: false,
          error: testResult.error || "Error en try-on",
        },
      };
    }

    return {
      success: true,
      message:
        "Try-on generado exitosamente con Gemini 2.5 Flash Image Preview",
      details: {
        apiKeyValid: true,
        modelAvailable: true,
        canAnalyzeImages: true,
        canGenerateContent: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error en try-on",
      details: {
        apiKeyValid: false,
        modelAvailable: false,
        canAnalyzeImages: false,
        canGenerateContent: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
    };
  }
}
