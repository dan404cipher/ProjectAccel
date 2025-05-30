import mongoose, { Document, Schema } from 'mongoose';
import is from 'utils/validation';

export interface IComment extends Document {
  body: string;
  createdAt: Date;
  updatedAt: Date;
  userId: mongoose.Types.ObjectId;
  issueId: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
  body: {
    type: String,
    required: true,
    maxlength: 50000,
    trim: true,
    validate: is.required()
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  issueId: {
    type: Schema.Types.ObjectId,
    ref: 'Issue',
    required: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
commentSchema.index({ issueId: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });

// Add compound index for common queries
commentSchema.index({ issueId: 1, userId: 1 });

// Virtuals for populated fields
commentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

commentSchema.virtual('issue', {
  ref: 'Issue',
  localField: 'issueId',
  foreignField: '_id',
  justOne: true
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema); 