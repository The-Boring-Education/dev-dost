import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data-science' | 'machine-learning' | 'ai' | 'blockchain' | 'devops' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string; // e.g., "2-4 weeks", "1-2 months"
  createdBy: string; // "system" for predefined projects or userId for user-created
  isActive: boolean;
  isPredefined: boolean;
  features: string[];
  learningOutcomes: string[];
  requiredSkills: string[];
  image?: string;
  githubRepo?: string;
  liveDemo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  techStack: [{
    type: String,
    required: true,
    trim: true,
  }],
  category: {
    type: String,
    required: true,
    enum: ['fullstack', 'frontend', 'backend', 'mobile', 'data-science', 'machine-learning', 'ai', 'blockchain', 'devops', 'other'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  estimatedDuration: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPredefined: {
    type: Boolean,
    default: false,
  },
  features: [{
    type: String,
    trim: true,
  }],
  learningOutcomes: [{
    type: String,
    trim: true,
  }],
  requiredSkills: [{
    type: String,
    trim: true,
  }],
  image: {
    type: String,
    default: '',
  },
  githubRepo: {
    type: String,
    default: '',
  },
  liveDemo: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ difficulty: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ isPredefined: 1 });
ProjectSchema.index({ techStack: 1 });
ProjectSchema.index({ createdBy: 1 });

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;