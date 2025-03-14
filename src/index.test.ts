/// <reference types="jest" />
import axios from 'axios';
import Facebook from './index';

jest.mock('axios');

// Add interface for config
interface MockConfig {
  appId: string;
  appSecret: string;
  redirectUrl: string;
  graphVersion: string;
}

describe('Facebook', () => {
  const mockConfig: MockConfig = {
    appId: 'testAppId',
    appSecret: 'testAppSecret',
    redirectUrl: 'https://example.com/callback',
    graphVersion: 'v20.0',
  };

  let facebook: Facebook;

  beforeEach(() => {
    facebook = new Facebook(mockConfig);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with valid config', () => {
      expect(facebook).toBeInstanceOf(Facebook);
    });

    it('should throw an error if required params are missing', () => {
      expect(() => new Facebook({})).toThrow();
    });

    it('should accept an accessToken instead of app credentials', () => {
      const fbWithToken = new Facebook({ accessToken: 'testToken' });
      expect(fbWithToken).toBeInstanceOf(Facebook);
    });
  });

  describe('getLoginUrl', () => {
    it('should return a valid login URL', () => {
      const url = facebook.getLoginUrl(['email', 'public_profile']);
      expect(url).toMatch(/https:\/\/www\.facebook\.com\/v20\.0\/dialog\/oauth/);
      expect(url).toContain('client_id=testAppId');
      expect(url).toContain('redirect_uri=https://example.com/callback');
      expect(url).toContain('scope=email,public_profile');
      expect(url).toContain('state=');
    });
  });

  describe('callback', () => {
    it('should make a GET request to exchange code for token', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: { access_token: 'newToken' },
      });
      await facebook.callback('testCode');
      expect(axios.get).toHaveBeenCalledWith(
        'https://graph.facebook.com/v20.0/oauth/access_token',
        expect.objectContaining({
          params: expect.objectContaining({
            code: 'testCode',
          }),
        })
      );
    });
  });

  describe('accessToken methods', () => {
    it('should get and set accessToken', () => {
      facebook.setAccessToken('newToken');
      expect(facebook.getAccessToken()).toBe('newToken');
    });
  });

  describe('getBaseUrl', () => {
    it('should return the correct base URL', () => {
      expect(facebook.getBaseUrl()).toBe('https://graph.facebook.com/v20.0');
    });
  });

  describe('API methods', () => {
    beforeEach(() => {
      facebook.setAccessToken('testToken');
    });

    it('should throw an error if no access token is provided', async () => {
      // @ts-expect-error - Setting to undefined for testing
      facebook.setAccessToken(undefined);
      await expect(facebook.get('/me')).rejects.toThrow('Access token is required');
    });

    // Test for unsupported method by accessing the private method directly
    it('should throw an error for unsupported method', async () => {
      // @ts-expect-error - Accessing private method for testing
      await expect(facebook['makeRequest']('put', '/me', {}, 'token')).rejects.toThrow(
        'Unsupported method'
      );
    });

    describe('get', () => {
      it('should make a GET request with access token', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: {} });
        await facebook.get('/me');
        expect(axios.get).toHaveBeenCalledWith(
          'https://graph.facebook.com/v20.0/me',
          expect.objectContaining({
            params: { access_token: 'testToken' },
          })
        );
      });
    });

    describe('post', () => {
      it('should make a POST request with page token', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ data: {} });
        const testPageToken = 'testPageToken';
        facebook.setAccessToken(testPageToken);
        await facebook.post('/me/feed', { message: 'Test post' });
        expect(axios.post).toHaveBeenCalledWith(
          'https://graph.facebook.com/v20.0/me/feed',
          { message: 'Test post' },
          expect.objectContaining({
            params: { access_token: testPageToken },
          })
        );
      });
    });

    describe('delete', () => {
      it('should make a DELETE request with page token to delete a page post', async () => {
        (axios.delete as jest.Mock).mockResolvedValue({ data: {} });
        const testPageToken = 'testPageToken';
        facebook.setAccessToken(testPageToken);
        const postId = '123456';
        await facebook.delete(`/${postId}`);
        expect(axios.delete).toHaveBeenCalledWith(
          `https://graph.facebook.com/v20.0/${postId}`,
          expect.objectContaining({
            params: { access_token: testPageToken },
          })
        );
      });
    });
  });
});
