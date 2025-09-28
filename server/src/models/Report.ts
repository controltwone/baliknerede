import mongoose from 'mongoose'

export interface IReport extends mongoose.Document {
  postId: mongoose.Types.ObjectId
  reporterId: mongoose.Types.ObjectId
  reason: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

const reportSchema = new mongoose.Schema<IReport>({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  reporterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'], 
    default: 'pending' 
  },
  adminNotes: { 
    type: String 
  }
}, { timestamps: true })

const ReportModel = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema)
export default ReportModel
module.exports = ReportModel
