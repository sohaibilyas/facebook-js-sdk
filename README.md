# Facebook JS SDK

[![npm version](https://badge.fury.io/js/facebook-js-sdk.svg)](https://badge.fury.io/js/facebook-js-sdk)
[![Build Status](https://github.com/sohaibilyas/facebook-js-sdk/workflows/CI/badge.svg)](https://github.com/sohaibilyas/facebook-js-sdk/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple npm package to interact with Facebook API.

## Features

- 🚀 Full TypeScript support
- 📦 Zero dependencies (except axios)
- 🔒 OAuth 2.0 authentication
- 🌐 Facebook Graph API support
- ✨ Modern ES6+ syntax
- 📝 Comprehensive type definitions

## Installation

```bash
npm install facebook-js-sdk
```

## Usage

### JavaScript

```javascript
const Facebook = require('facebook-js-sdk');

const fb = new Facebook({
  appId: 'your-app-id',
  appSecret: 'your-app-secret',
  redirectUrl: 'your-redirect-url'
});

// Get login URL
const url = fb.getLoginUrl(['email', 'public_profile']);

// Exchange code for token
fb.callback('code-from-facebook')
  .then(response => {
    fb.setAccessToken(response.data.access_token);
  });

// Make API calls
fb.get('/me')
  .then(response => console.log(response.data));
```

### TypeScript

```typescript
import Facebook from 'facebook-js-sdk';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
}

const fb = new Facebook({
  appId: 'your-app-id',
  appSecret: 'your-app-secret',
  redirectUrl: 'your-redirect-url'
});

// Get login URL with type-safe permissions
const url = fb.getLoginUrl(['email', 'public_profile']);

// Exchange code for token with type safety
const response = await fb.callback('code-from-facebook');
fb.setAccessToken(response.data.access_token);

// Make API calls with type safety
const profile = await fb.get<UserProfile>('/me');
console.log(profile.data.name);
```

## API Reference

### Constructor

```typescript
new Facebook({
  appId?: string;
  appSecret?: string;
  redirectUrl?: string;
  graphVersion?: string; // defaults to 'v20.0'
  accessToken?: string;
})
```

You must provide either:
- `accessToken` for direct API access, or
- `appId`, `appSecret`, and `redirectUrl` for OAuth flow

### Methods

#### `getLoginUrl(permissions: string[]): string`
Generate a Facebook login URL with the specified permissions.

#### `callback(code: string): Promise<{ access_token: string, ... }>`
Exchange an OAuth code for an access token.

#### `getAccessToken(): string | undefined`
Get the current access token.

#### `setAccessToken(accessToken: string): void`
Set the access token for API calls.

#### `get<T>(path: string, accessToken?: string): Promise<{ data: T }>`
Make a GET request to the Facebook API.

#### `post<T>(path: string, options: object, accessToken?: string): Promise<{ data: T }>`
Make a POST request to the Facebook API.

#### `delete<T>(path: string, accessToken?: string): Promise<{ data: T }>`
Make a DELETE request to the Facebook API.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Build
npm run build
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
