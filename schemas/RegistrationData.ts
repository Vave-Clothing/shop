import mongoose from 'mongoose'

interface RegistrationData {
  name: string
  email: string
}

const registrationDataSchema = new mongoose.Schema<RegistrationData>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true })

const RegistrationData = mongoose.models.RegistrationDatas || mongoose.model<RegistrationData>('RegistrationDatas', registrationDataSchema)
export default RegistrationData