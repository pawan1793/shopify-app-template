import { laravelAuth } from "./laravelAuth";
import type { LoaderFunctionArgs } from "@remix-run/node";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductResponse {
  products: Product[];
  status: string;
}

export async function getProductData(request: LoaderFunctionArgs['request']): Promise<ProductResponse | null> {
  try {
    const productData = await laravelAuth.makeAuthenticatedRequest<ProductResponse>('/products', request);
    console.log('Product Data:', productData);
    return productData;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
} 