declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PORT: string;
    readonly CLIENT_URL: string;
    readonly PUBLIC_VAPID_KEY: string;
    readonly PRIVATE_VAPID_KEY: string;
  }
}
