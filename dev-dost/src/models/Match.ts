import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  projectId: string;
  user1Id: string;
  user2Id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  matchedAt: Date;
  conversationStarted: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>({
  projectId: {
    type: String,
    required: true,
    ref: 'Project',
  },
  user1Id: {
    type: String,
    required: true,
    ref: 'User',
  },
  user2Id: {
    type: String,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  matchedAt: {
    type: Date,
    default: Date.now,
  },
  conversationStarted: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    maxlength: 500,
    default: '',
  },
}, {
  timestamps: true,
});

// Compound index to ensure one match per project per user pair
MatchSchema.index({ projectId: 1, user1Id: 1, user2Id: 1 }, { unique: true });

// Indexes for better query performance
MatchSchema.index({ user1Id: 1 });
MatchSchema.index({ user2Id: 1 });
MatchSchema.index({ projectId: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ matchedAt: -1 });

// Virtual to get the other user ID when you know one user ID
MatchSchema.virtual('getOtherUserId').get(function(currentUserId: string) {
  return this.user1Id === currentUserId ? this.user2Id : this.user1Id;
});

const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);

export default Match;