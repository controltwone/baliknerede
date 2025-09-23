import mongoose from 'mongoose'

interface IComment {
  userId: mongoose.Types.ObjectId
  text: string
  createdAt: Date
}

interface IPost extends mongoose.Document {
  authorId: mongoose.Types.ObjectId
  contentText?: string
  imageUrl?: string
  likeCount: number
  commentCount: number
  likes: mongoose.Types.ObjectId[]
  comments: IComment[]
}

const commentSchema = new mongoose.Schema<IComment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const postSchema = new mongoose.Schema<IPost>({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentText: { type: String },
  imageUrl: { type: String },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
}, { timestamps: true })

const PostModel = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema)
export default PostModel
module.exports = PostModel


