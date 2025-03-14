import axios, { AxiosResponse } from 'axios';
import { createHash } from 'crypto';

interface FacebookConfig {
  appId?: string;
  appSecret?: string;
  redirectUrl?: string;
  graphVersion?: string;
  accessToken?: string;
}

interface FacebookResponse<T> {
  data: T;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class Facebook {
  private config: FacebookConfig;
  private baseUrl: string;
  private accessToken?: string;

  constructor({
    appId,
    appSecret,
    redirectUrl,
    graphVersion = 'v20.0',
    accessToken,
  }: FacebookConfig) {
    if (!accessToken && (!appId || !appSecret || !redirectUrl)) {
      throw new Error('Either accessToken or appId, appSecret, and redirectUrl are required');
    }

    this.config = { appId, appSecret, redirectUrl, graphVersion };
    this.baseUrl = `https://graph.facebook.com/${graphVersion}`;
    if (accessToken) {
      this.accessToken = accessToken;
    }
  }

  public getLoginUrl(permissions: string[] = []): string {
    const state = createHash('sha256').update(Date.now().toString()).digest('hex');

    return (
      'https://www.facebook.com/' +
      this.config.graphVersion +
      '/dialog/oauth?client_id=' +
      this.config.appId +
      '&redirect_uri=' +
      this.config.redirectUrl +
      '&scope=' +
      permissions.join(',') +
      '&state=' +
      state
    );
  }

  public callback(code: string): Promise<AxiosResponse<AccessTokenResponse>> {
    return axios.get(`${this.baseUrl}/oauth/access_token`, {
      params: {
        client_id: this.config.appId,
        client_secret: this.config.appSecret,
        redirect_uri: this.config.redirectUrl,
        code: code,
      },
    });
  }

  public getAccessToken(): string | undefined {
    return this.accessToken;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  private ensureLeadingSlash(path: string): string {
    return path.startsWith('/') ? path : '/' + path;
  }

  public async get<T>(path: string, accessToken?: string): Promise<FacebookResponse<T>> {
    return this.makeRequest<T>('get', path, undefined, accessToken);
  }

  public async post<T>(
    path: string,
    options: Record<string, unknown>,
    accessToken?: string
  ): Promise<FacebookResponse<T>> {
    return this.makeRequest<T>('post', path, options, accessToken);
  }

  public async delete<T>(path: string, accessToken?: string): Promise<FacebookResponse<T>> {
    return this.makeRequest<T>('delete', path, undefined, accessToken);
  }

  private async makeRequest<T>(
    method: 'get' | 'post' | 'delete',
    path: string,
    options?: Record<string, unknown>,
    accessToken?: string
  ): Promise<FacebookResponse<T>> {
    const token = accessToken || this.accessToken;
    if (!token) {
      throw new Error('Access token is required');
    }

    const url = `${this.baseUrl}${this.ensureLeadingSlash(path)}`;
    let response;

    if (method === 'get') {
      response = await axios.get(url, {
        params: { ...options, access_token: token },
      });
    } else if (method === 'post') {
      response = await axios.post(url, { ...options }, { params: { access_token: token } });
    } else if (method === 'delete') {
      response = await axios.delete(url, {
        params: { access_token: token },
      });
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    return response;
  }
}

export = Facebook;
