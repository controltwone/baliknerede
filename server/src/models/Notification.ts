import mongoose from 'mongoose'

export interface INotification extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  actorId: mongoose.Types.ObjectId
  type: 'new_post' | 'like' | 'comment' | 'follow'
  postId?: mongoose.Types.ObjectId
  read: boolean
}

const notificationSchema = new mongoose.Schema<INotification>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['new_post', 'like', 'comment', 'follow'], required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  read: { type: Boolean, default: false },
}, { timestamps: true })

const NotificationModel = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema)
export default NotificationModel


