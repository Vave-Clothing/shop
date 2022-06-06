import mongoose from 'mongoose'

interface Product {
  sanityID: string
  slug: string
}

const productSchema = new mongoose.Schema<Product>({
  sanityID: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
}, { timestamps: true })

const Product = mongoose.models.Products || mongoose.model<Product>('Products', productSchema)
export default Product