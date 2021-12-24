import mongoose from 'mongoose'

interface Order {
  platform?: "stripe" | "paypal",
  pid: string,
  purchased_items: purchasedItems[]
  total_price: number
  status?: "pending" | "processing" | "paid" | "refunded"
  date: Date
}

interface purchasedItems {
  id: string
  quantity: number
  price: string
}

const orderSchema = new mongoose.Schema<Order>({
  platform: {
    type: String,
    required: true,
    default: 'stripe',
    enum: [ 'stripe', 'paypal' ],
  },
  pid: {
    type: String,
    required: true,
  },
  purchased_items: [{
    id: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: [ 'pending', 'paid', 'refunded', 'processing' ]
  },
  date: {
    type: Date,
    required: true,
  }
})

module.exports = mongoose.models.Orders || mongoose.model<Order>('Orders', orderSchema)