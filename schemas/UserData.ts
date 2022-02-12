import mongoose from 'mongoose'

interface UserData {
  uid: string
  stripeCustomerID: string
  theme: "light" | "dark" | "system"
}

const userDataSchema = new mongoose.Schema<UserData>({
  uid: {
    type: String,
    required: true,
  },
  stripeCustomerID: {
    type: String,
    default: "",
  },
  theme: {
    type: String,
    default: "light",
    enum: ['light', 'dark', 'system'],
  },
}, { timestamps: true })

const UserData = mongoose.models.UserData || mongoose.model<UserData>('UserData', userDataSchema)
export default UserData