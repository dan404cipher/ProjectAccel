import mongoose, { Document, Schema } from 'mongoose';
import striptags from 'striptags';
import is from 'utils/validation';
import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';
import Joi from 'joi';

export interface IIssue extends Document {
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  listPosition: number;
  description?: string;
  descriptionText?: string;
  estimate?: number;
  timeSpent?: number;
  timeRemaining?: number;
  createdAt: Date;
  updatedAt: Date;
  reporterId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  sprintId?: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
}

const issueSchema = new Schema<IIssue>({
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true,
    validate: is.required()
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(IssueType),
    validate: [is.required(), is.oneOf(Object.values(IssueType))]
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(IssueStatus),
    validate: [is.required(), is.oneOf(Object.values(IssueStatus))]
  },
  priority: {
    type: String,
    required: true,
    enum: Object.values(IssuePriority),
    validate: [is.required(), is.oneOf(Object.values(IssuePriority))]
  },
  listPosition: {
    type: Number,
    required: true,
    validate: is.required()
  },
  description: {
    type: String,
    trim: true
  },
  descriptionText: {
    type: String,
    trim: true
  },
  estimate: {
    type: Number,
    min: 0
  },
  timeSpent: {
    type: Number,
    min: 0
  },
  timeRemaining: {
    type: Number,
    min: 0
  },
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: is.required()
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  sprintId: {
    type: Schema.Types.ObjectId,
    ref: 'Sprint'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
issueSchema.index({ projectId: 1, status: 1 });
issueSchema.index({ projectId: 1, type: 1 });
issueSchema.index({ projectId: 1, priority: 1 });
issueSchema.index({ reporterId: 1 });
issueSchema.index({ sprintId: 1 });

// Add compound indexes for common queries
issueSchema.index({ projectId: 1, listPosition: 1 });
issueSchema.index({ projectId: 1, createdAt: -1 });

// Add pre-save middleware to set descriptionText
issueSchema.pre('save', function(next) {
  if (this.description) {
    this.descriptionText = striptags(this.description);
  }
  next();
});

// Virtuals for populated fields
issueSchema.virtual('project', {
  ref: 'Project',
  localField: 'projectId',
  foreignField: '_id',
  justOne: true
});

issueSchema.virtual('sprint', {
  ref: 'Sprint',
  localField: 'sprintId',
  foreignField: '_id',
  justOne: true
});

issueSchema.virtual('reporter', {
  ref: 'User',
  localField: 'reporterId',
  foreignField: '_id',
  justOne: true
});

const baseIssueSchema = {
  title: Joi.string().required().max(200),
  type: Joi.string().valid(...Object.values(IssueType)).required(),
  status: Joi.string().valid(...Object.values(IssueStatus)).required(),
  priority: Joi.string().valid(...Object.values(IssuePriority)).required(),
  listPosition: Joi.number().required(),
  description: Joi.string().allow(''),
  estimate: Joi.number().min(0),
  timeSpent: Joi.number().min(0),
  reporterId: Joi.string().required(),
  projectId: Joi.string().required(),
  users: Joi.array().items(Joi.string())
};

export const createIssueSchema = Joi.object({
  ...baseIssueSchema
});

export const updateIssueSchema = Joi.object({
  ...baseIssueSchema,
  title: Joi.string().max(200),
  type: Joi.string().valid(...Object.values(IssueType)),
  status: Joi.string().valid(...Object.values(IssueStatus)),
  priority: Joi.string().valid(...Object.values(IssuePriority)),
  listPosition: Joi.number(),
  reporterId: Joi.string(),
  projectId: Joi.string()
}); 