import mongoose from 'mongoose'

// Source: https://gist.github.com/skolhustick/fa023be077a41139b830a8f6626ca4f3

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}


let cached: any

if(process.env.NODE_ENV === 'development') {
  // @ts-ignore
  cached = global.mongoose

  if (!cached) {
    // @ts-ignore
    cached = global.mongoose = { conn: null, promise: null }
  }
} else {
  cached = { conn: null, promise: null }
}



async function dbConnect () {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect