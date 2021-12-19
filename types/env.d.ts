declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_STRIPE_PK: string
    STRIPE_SK: string
    STRIPE_WS: string
  }
}