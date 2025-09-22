"use server";
import "server-only";
import { mockProducts, getProductById } from '@/lib/mock-data';
import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  // Simular delay de red para hacer más realista
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockProducts;
}

export async function getProduct(id: string): Promise<Product | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 50));
  const product = getProductById(id);
  return product || null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockProducts.filter(product => product.category === category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 150));

  if (!query || query.trim().length === 0) {
    return mockProducts;
  }

  const searchTerm = query.toLowerCase().trim();

  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.colors.some(color => color.toLowerCase().includes(searchTerm))
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));

  // Devolver los primeros 4 productos como destacados
  return mockProducts.slice(0, 4);
}
