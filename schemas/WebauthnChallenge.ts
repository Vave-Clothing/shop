import mongoose from 'mongoose'

interface Challenge {
  userID: string
  value: string
}

const challengeSchema = new mongoose.Schema<Challenge>({
  userID: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
}, { timestamps: true })

const Challenge = mongoose.models.Challenges || mongoose.model<Challenge>('Challenges', challengeSchema)
export default Challenge