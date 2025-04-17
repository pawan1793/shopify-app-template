import { laravelAuth } from "./laravelAuth";
import type { LoaderFunctionArgs } from "@remix-run/node";

export interface UserData {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    access_token: string;
  };
  message: string;
}

export async function getUserData(request: LoaderFunctionArgs['request']): Promise<UserData | null> {
  try {
    const userData = await laravelAuth.makeAuthenticatedRequest<UserData>('/user', request);
    console.log('User Data:', userData);
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
} 