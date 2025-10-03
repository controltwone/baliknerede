import mongoose from 'mongoose'
import * as bcrypt from 'bcryptjs'

interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  bio?: string
  avatarUrl?: string
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  isAdmin?: boolean
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  bio: { type: String, maxlength: 500 },
  avatarUrl: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  // @ts-ignore
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = function(candidate: string) {
  // @ts-ignore
  return bcrypt.compare(candidate, this.password)
}

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
export default UserModel

