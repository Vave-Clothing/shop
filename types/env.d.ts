declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_STRIPE_PK: string
    STRIPE_SK: string
    STRIPE_WS: string
    NEXT_PUBLIC_PAYPAL_CID: string
    PAYPAL_CS: string
    PAYPAL_WID: string
    MONGODB_URI: string
    EMAIL_SERVER_USER: string
    EMAIL_SERVER_PASSWORD: string
    EMAIL_SERVER_HOST: string
    EMAIL_SERVER_PORT: number
    EMAIL_FROM: string
    WEBAUTHN_DBNAME: string
    APP_DOMAIN: string
    APP_ORIGIN: string
    APP_NAME: string
  }
}