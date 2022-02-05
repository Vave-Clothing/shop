import mongoose from 'mongoose'

interface Credential {
  credentialID: string
  credentialName: string
  userID: string
  userEmail: string
  transports: AuthenticatorTransport[]
  credentialPublicKey: Buffer
  counter: number
}

const credentialSchema = new mongoose.Schema<Credential>({
  credentialID: {
    type: String,
    required: true,
  },
  credentialName: {
    type: String,
    required: true,
    default: 'WebAuthn',
  },
  userID: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  transports: [{
    type: String,
    required: true,
    enum: [ 'ble', 'internal', 'nfc', 'usb'] 
  }],
  credentialPublicKey: {
    type: Buffer,
    required: true,
  },
  counter: {
    type: Number,
    required: true,
  },
}, { timestamps: true })

const Credential = mongoose.models.Credentials || mongoose.model<Credential>('Credentials', credentialSchema)
export default Credential