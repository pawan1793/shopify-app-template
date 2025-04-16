import db from "../db.server";

interface LaravelAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
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

  private async getLaravelToken(): Promise<string | null> {
    const session = await db.session.findFirst();
    return session?.laravelToken || null;
  }

  private async setLaravelToken(token: string): Promise<void> {
    const session = await db.session.findFirst();
    if (session) {
      await db.session.update({
        where: { id: session.id },
        data: { laravelToken: token }
      });
    }
  }

  private async refreshToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add your login credentials here
          email: process.env.LARAVEL_API_EMAIL,
          password: process.env.LARAVEL_API_PASSWORD,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data: LaravelAuthResponse = await response.json();
      await this.setLaravelToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  public async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let token = await this.getLaravelToken();
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
          },
        });

        if (response.status === 401 && retryCount < maxRetries) {
          // Token expired, try to refresh
          token = await this.refreshToken();
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

// Export a singleton instance
export const laravelAuth = LaravelAuth.getInstance(); 