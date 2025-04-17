import { authenticate } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import db from "../db.server";

interface LaravelAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SessionWithLaravelToken {
  id: string;
  shop: string;
  laravelToken?: string;
}

export class LaravelAuth {
  private static instance: LaravelAuth;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';
  }

  public static getInstance(): LaravelAuth {
    if (!LaravelAuth.instance) {
      LaravelAuth.instance = new LaravelAuth();
    }
    return LaravelAuth.instance;
  }

  private async getLaravelToken(request: LoaderFunctionArgs['request']): Promise<string | null> {
    const { session } = await authenticate.admin(request);
    const dbSession = await db.session.findUnique({
      where: { id: session.id }
    });
    return dbSession?.laravelToken || null;
  }

  private async setLaravelToken(request: LoaderFunctionArgs['request'], token: string): Promise<void> {
    const { session } = await authenticate.admin(request);
    if (session) {
      await db.session.update({
        where: { id: session.id },
        data: { laravelToken: token }
      });
    }
  }

  private async refreshToken(request: LoaderFunctionArgs['request']): Promise<string> {
    try {
      const { session } = await authenticate.admin(request);
      console.log("===============================")
      console.log(session)
      console.log("==============================")
      if (!session || !session.shop || !session.id) {
        throw new Error('No valid session found');
      }
      
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: session.shop,
          id: session.id,
        }),
      });
   
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data: LaravelAuthResponse = await response.json();
      await this.setLaravelToken(request, data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  public async makeAuthenticatedRequest<T>(
    endpoint: string,
    request: LoaderFunctionArgs['request'],
    options: RequestInit = {}
  ): Promise<T> {
    let token = await this.getLaravelToken(request);
    let retryCount = 0;
    const maxRetries = 1;

    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.status === 401 && retryCount < maxRetries) {
          token = await this.refreshToken(request);
          retryCount++;
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (retryCount >= maxRetries) {
          throw error;
        }
        retryCount++;
      }
    }

    throw new Error('Failed to make authenticated request');
  }
}

export const laravelAuth = LaravelAuth.getInstance();