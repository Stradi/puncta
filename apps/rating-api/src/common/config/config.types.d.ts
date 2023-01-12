export interface Config {
  jwt: JwtConfig;
}

export interface JwtConfig {
  expiresIn: string;
  refreshIn: string;
}
