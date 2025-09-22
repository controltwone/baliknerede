import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not set')
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 } as any)
  mongoose.connection.on('connected', () => console.log('Mongo connected'))
  mongoose.connection.on('error', (err) => console.error('Mongo error', err))
}

