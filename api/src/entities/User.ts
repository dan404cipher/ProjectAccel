import mongoose, { Document, Schema } from 'mongoose';
import is from 'utils/validation';

export interface IUser extends Document {
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  comments: mongoose.Types.ObjectId[];
  issues: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
  currentProjectId?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  email: {
    type: String,
    required: true,
    maxlength: 200,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatarUrl: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  issues: [{
    type: Schema.Types.ObjectId,
    ref: 'Issue'
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  currentProjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ currentProjectId: 1 });

// Virtual for currentProject
userSchema.virtual('currentProject', {
  ref: 'Project',
  localField: 'currentProjectId',
  foreignField: '_id',
  justOne: true
});

export const User = mongoose.model<IUser>('User', userSchema);
