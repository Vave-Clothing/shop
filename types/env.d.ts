declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_STRIPE_PK: string
    STRIPE_SK: string
    NEXT_PUBLIC_PAYPAL_CID: string
    PAYPAL_CS: string
    MONGODB_URI: string
  }
}