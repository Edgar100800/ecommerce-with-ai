export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    sizes: string[];
    colors: string[];
    category: string;
    inStock: boolean;
}

export interface TryOnRequest {
    userPhoto: File;
    productId: string;
    productImage: string;
}

export interface TryOnResponse {
    success: boolean;
    result?: string; // base64 image or URL or analysis text (primary result)
    results?: string[]; // array of all successful results when multiple attempts made
    error?: string;
    errors?: string[]; // array of errors from failed attempts
    analysis?: string; // text analysis from Gemini
}

export interface CartItem {
    productId: string;
    quantity: number;
    size: string;
    color: string;
}

// OpenRouter response types for image generation
export interface OpenRouterImageUrl {
    url: string;
    detail?: string;
}

export interface OpenRouterImage {
    type: "image_url";
    image_url: OpenRouterImageUrl;
    index: number;
}

export interface OpenRouterMessage {
    role: string;
    content: string | null;
    refusal?: string | null;
    reasoning?: string | null;
    images?: OpenRouterImage[];
}

export interface OpenRouterLogprobs {
    tokens?: string[];
    token_logprobs?: number[];
    top_logprobs?: Record<string, number>[];
    text_offset?: number[];
}

export interface OpenRouterChoice {
    logprobs: OpenRouterLogprobs | null;
    finish_reason: string;
    native_finish_reason: string;
    index: number;
    message: OpenRouterMessage;
}

export interface OpenRouterResponse {
    id: string;
    provider: string;
    model: string;
    object: string;
    created: number;
    choices: OpenRouterChoice[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        prompt_tokens_details?: {
            cached_tokens: number;
        };
        completion_tokens_details?: {
            reasoning_tokens: number;
            image_tokens: number;
        };
    };
}
