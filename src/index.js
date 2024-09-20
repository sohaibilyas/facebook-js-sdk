const axios = require("axios");
const crypto = require("crypto");

class Facebook {
  constructor({
    appId,
    appSecret,
    redirectUrl,
    graphVersion = "v20.0",
    accessToken,
  }) {
    if (!accessToken && (!appId || !appSecret || !redirectUrl)) {
      throw new Error(
        "Either accessToken or appId, appSecret, and redirectUrl are required"
      );
    }

    this.config = { appId, appSecret, redirectUrl, graphVersion };
    this.baseUrl = `https://graph.facebook.com/${graphVersion}`;
    if (accessToken) {
      this.accessToken = accessToken;
    }
  }

  getLoginUrl(permissions = []) {
    const state = crypto.randomBytes(24).toString("hex");

    return (
      "https://www.facebook.com/" +
      this.config.graphVersion +
      "/dialog/oauth?client_id=" +
      this.config.appId +
      "&redirect_uri=" +
      this.config.redirectUrl +
      "&scope=" +
      permissions.join(",") +
      "&state=" +
      state
    );
  }

  callback(code) {
    return axios.get(`${this.baseUrl}/oauth/access_token`, {
      params: {
        client_id: this.config.appId,
        client_secret: this.config.appSecret,
        redirect_uri: this.config.redirectUrl,
        code: code,
      },
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  ensureLeadingSlash(path) {
    return path.startsWith("/") ? path : "/" + path;
  }

  get(path, accessToken) {
    if (!accessToken) {
      accessToken = this.accessToken;
    }

    return axios.get(`${this.baseUrl}${this.ensureLeadingSlash(path)}`, {
      params: {
        access_token: accessToken,
      },
    });
  }

  post(path, options, accessToken) {
    if (!accessToken) {
      accessToken = this.accessToken;
    }

    return axios.post(
      `${this.baseUrl}${this.ensureLeadingSlash(path)}`,
      options,
      {
        params: {
          access_token: accessToken,
        },
      }
    );
  }

  delete(path, accessToken) {
    if (!accessToken) {
      accessToken = this.accessToken;
    }

    return axios.delete(`${this.baseUrl}${this.ensureLeadingSlash(path)}`, {
      params: {
        access_token: accessToken,
      },
    });
  }
}

module.exports = Facebook;
module.exports.default = Facebook;
