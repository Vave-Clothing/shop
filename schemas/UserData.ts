import mongoose from 'mongoose'

interface UserData {
  uid: string
  stripeCustomerID: string
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
}, { timestamps: true })

const UserData = mongoose.models.UserData || mongoose.model<UserData>('UserData', userDataSchema)
export default UserData