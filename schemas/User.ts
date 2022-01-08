import mongoose from 'mongoose'

interface User {
  name?: string
  email: string
  email_verified: Date
  image?: string
  id?: string
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  email_verified: {
    type: Date,
    required: true,
    default: new Date(),
  },
  image: {
    type: String,
    default: "",
  },
  id: {
    type: String,
  },
}, { versionKey: false })

const User = mongoose.models.Users || mongoose.model<User>('Users', userSchema)
export default User