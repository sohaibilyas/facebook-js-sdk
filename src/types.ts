export type FacebookConfig = {
  appId?: string;
  appSecret?: string;
  redirectUrl?: string;
  graphVersion?: string;
  accessToken?: string;
};

export type FacebookResponse = {
  data: object | Array<object>;
};

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};
