import axios from "axios";

export default class Facebook {
  config = {};

  accessToken = null;
  baseUrl = "https://graph.facebook.com/";

  constructor(config) {
    if (!config.graphVersion) {
      config.graphVersion = "v7.0";
    }

    this.config = Object.assign({}, config, this.config);
    this.baseUrl += this.config.graphVersion;
  }

  getLoginUrl(permissions = []) {
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

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
    return axios.get(
      this.baseUrl +
        "/oauth/access_token?client_id=" +
        this.config.appId +
        "&client_secret=" +
        this.config.appSecret +
        "&redirect_uri=" +
        this.config.redirectUrl +
        "&code=" +
        code
    );
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

  get(path, accessToken) {
    if (!accessToken) {
      accessToken = this.accessToken;
    }

    var separator = "?";
    if (path.includes("?")) {
      separator = "&";
    }

    return axios.get(
      this.baseUrl + path + separator + "access_token=" + accessToken
    );
  }

  post(path, options, accessToken) {
    if (!accessToken) {
      accessToken = this.accessToken;
    }

    var separator = "?";
    if (path.includes("?")) {
      separator = "&";
    }

    return axios.post(
      this.baseUrl + path + separator + "access_token=" + accessToken,
      options
    );
  }

  delete(path, accessToken) {
    if (!accessToken) {
      accessToken = this.accessToken;
    }

    return axios.delete(this.baseUrl + path + "?access_token=" + accessToken);
  }
}
