import mongoose from 'mongoose'

interface Order {
  platform?: "stripe" | "paypal",
  pid: string,
  order_number: string
  purchased_items: purchasedItems[]
  total_price: number
  email?: string
  shipping_address: shippingAddress
  shipping_rate: shippingRate
  status?: "pending" | "processing" | "failed" | "paid" | "refunded" | "disputed"
  shipping_status?: "orderRecieved" | "handedOver" | "onTheWay" | "atCustomers"
  stripePI?: string
  stripeReceipt?: string
}

interface purchasedItems {
  id: string
  quantity: number
  price: number
}

interface shippingAddress {
  name?: string
  line1?: string
  line2?: string
  zip?: number
  city?: string
  state?: string
  country?: "DE" | "AT" | "CH"
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
  order_number: {
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
    default: null,
  },
  shipping_address: {
    name: {
      type: String,
      default: null,
    },
    line1: {
      type: String,
      default: null,
    },
    line2: {
      type: String,
      default: null,
    },
    zip: {
      type: Number,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
      enum: [ 'DE', 'AT', 'CH', null ],
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
  shipping_status: {
    type: String,
    default: 'orderRecieved',
    enum: [ 'orderRecieved', 'handedOver', 'onTheWay', 'atCustomers' ],
  },
  stripePI: {
    type: String,
    default: "",
  },
  stripeReceipt: {
    type: String,
    default: "",
  },
}, { timestamps: true })

const Order = mongoose.models.Orders || mongoose.model<Order>('Orders', orderSchema)
export default Order