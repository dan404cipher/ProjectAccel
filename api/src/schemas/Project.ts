import mongoose, { Document, Schema } from 'mongoose';
import { ProjectCategory } from 'constants/projects';
import Joi from 'joi';

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
    required: true
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
  versionKey: false
});

// Add indexes for better query performance
projectSchema.index({ name: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ users: 1 });

// Add compound index for common queries
projectSchema.index({ category: 1, name: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);

export const createProjectSchema = Joi.object({
  name: Joi.string().required().max(100).trim(),
  url: Joi.string().allow('', null).optional().trim(),
  description: Joi.string().allow('', null).optional().trim(),
  category: Joi.string().valid(...Object.values(ProjectCategory)).required()
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().max(100).trim(),
  url: Joi.string().allow('', null).optional().trim(),
  description: Joi.string().allow('', null).optional().trim(),
  category: Joi.string().valid(...Object.values(ProjectCategory))
}); 