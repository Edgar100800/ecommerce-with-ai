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
  result?: string; // base64 image or URL or analysis text
  error?: string;
  analysis?: string; // text analysis from Gemini
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}
