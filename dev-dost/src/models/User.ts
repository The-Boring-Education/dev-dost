import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  bio?: string;
  skills: string[];
  location?: string;
  contactPreferences: {
    whatsapp?: string;
    telegram?: string;
    email: string;
  };
  githubProfile?: string;
  portfolioUrl?: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: 500,
    default: '',
  },
  skills: [{
    type: String,
    trim: true,
  }],
  location: {
    type: String,
    trim: true,
    default: '',
  },
  contactPreferences: {
    whatsapp: {
      type: String,
      trim: true,
      default: '',
    },
    telegram: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
  },
  githubProfile: {
    type: String,
    default: '',
  },
  portfolioUrl: {
    type: String,
    default: '',
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  interests: [{
    type: String,
    trim: true,
  }],
  profileCompleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ skills: 1 });
UserSchema.index({ location: 1 });
UserSchema.index({ experience: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;