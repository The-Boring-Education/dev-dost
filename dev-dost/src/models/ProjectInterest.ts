import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectInterest extends Document {
  userId: string;
  projectId: string;
  interested: boolean; // true for swipe right, false for swipe left
  createdAt: Date;
  updatedAt: Date;
}

const ProjectInterestSchema = new Schema<IProjectInterest>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  projectId: {
    type: String,
    required: true,
    ref: 'Project',
  },
  interested: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one interest per user per project
ProjectInterestSchema.index({ userId: 1, projectId: 1 }, { unique: true });

// Indexes for better query performance
ProjectInterestSchema.index({ userId: 1 });
ProjectInterestSchema.index({ projectId: 1 });
ProjectInterestSchema.index({ interested: 1 });
ProjectInterestSchema.index({ projectId: 1, interested: 1 });

const ProjectInterest = mongoose.models.ProjectInterest || mongoose.model<IProjectInterest>('ProjectInterest', ProjectInterestSchema);

export default ProjectInterest;