import mongoose, { Document, Schema } from 'mongoose';
import { ProjectCategory } from 'constants/projects';

export interface IProject extends Document {
  name: string;
  url?: string;
  description?: string;
  category: ProjectCategory;
  createdAt: Date;
  updatedAt: Date;
  issues: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
  sprints: mongoose.Types.ObjectId[];
}

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(ProjectCategory)
  },
  issues: [{
    type: Schema.Types.ObjectId,
    ref: 'Issue'
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  sprints: [{
    type: Schema.Types.ObjectId,
    ref: 'Sprint'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  validateBeforeSave: false,
  strict: false,
  _id: true,
  versionKey: false
});

// Add indexes for better query performance
projectSchema.index({ name: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ users: 1 });

// Add compound index for common queries
projectSchema.index({ category: 1, name: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
