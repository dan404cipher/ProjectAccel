import mongoose, { Document, Schema } from 'mongoose';
import is from 'utils/validation';

export interface ISprint extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'planned';
  createdAt: Date;
  updatedAt: Date;
  projectId: mongoose.Types.ObjectId;
  issues: mongoose.Types.ObjectId[];
}

const sprintSchema = new Schema<ISprint>({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
    validate: is.required()
  },
  startDate: {
    type: Date,
    required: true,
    validate: is.required()
  },
  endDate: {
    type: Date,
    required: true,
    validate: is.required()
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'planned'],
    default: 'active'
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  issues: [{
    type: Schema.Types.ObjectId,
    ref: 'Issue'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
sprintSchema.index({ projectId: 1, status: 1 });
sprintSchema.index({ projectId: 1, startDate: 1 });
sprintSchema.index({ projectId: 1, endDate: 1 });

// Add compound index for common queries
sprintSchema.index({ projectId: 1, status: 1, startDate: 1 });

// Virtual for project
sprintSchema.virtual('project', {
  ref: 'Project',
  localField: 'projectId',
  foreignField: '_id',
  justOne: true
});

// Add validation to ensure endDate is after startDate
sprintSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

export const Sprint = mongoose.model<ISprint>('Sprint', sprintSchema); 