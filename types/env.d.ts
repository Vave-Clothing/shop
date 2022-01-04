declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_STRIPE_PK: string
    STRIPE_SK: string
    STRIPE_WS: string
    NEXT_PUBLIC_PAYPAL_CID: string
    PAYPAL_CS: string
    MONGODB_URI: string
    PAYPAL_WID: string
    PAYPAL_CID: string
  }
}