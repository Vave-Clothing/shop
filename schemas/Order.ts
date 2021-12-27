import mongoose from 'mongoose'

interface Order {
  platform?: "stripe" | "paypal",
  pid: string,
  purchased_items: purchasedItems[]
  total_price: number
  email: string
  shipping_address: shippingAddress
  shipping_rate: shippingRate
  status?: "pending" | "processing" | "failed" | "paid" | "refunded" | "disputed"
  stripePI?: string
}

interface purchasedItems {
  id: string
  quantity: number
  price: number
}

interface shippingAddress {
  name: string
  line1: string
  line2?: string
  zip: number
  city: string
  country: "DE" | "AT" | "CH"
}

interface shippingRate {
  id: string
  price: number
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
  email: {
    type: String,
    required: true,
  },
  shipping_address: {
    name: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
      default: '',
    },
    zip: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      enum: [ 'DE', 'AT', 'CH' ],
    },
  },
  shipping_rate: {
    id: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: [ 'pending', 'paid', 'failed', 'refunded', 'processing', 'disputed' ]
  },
  stripePI: {
    type: String,
    default: "",
  },
}, { timestamps: true })

const Order = mongoose.models.Orders || mongoose.model<Order>('Orders', orderSchema)
export default Order