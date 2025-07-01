const mongoose = require('mongoose');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devdost';

const predefinedProjects = [
  {
    title: "Social Media Dashboard",
    description: "Build a comprehensive social media management dashboard that allows users to schedule posts, track analytics, and manage multiple social accounts from one place.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "NextAuth"],
    category: "fullstack",
    difficulty: "intermediate",
    estimatedDuration: "4-6 weeks",
    createdBy: "system",
    isPredefined: true,
    isActive: true,
    features: [
      "Multi-platform posting",
      "Analytics dashboard", 
      "Content calendar",
      "Team collaboration",
      "Post scheduling"
    ],
    learningOutcomes: [
      "API integration",
      "Real-time data visualization",
      "Authentication & authorization",
      "Database design",
      "UI/UX best practices"
    ],
    requiredSkills: ["React", "Node.js", "Database design", "API integration"]
  },
  // Add more projects here...
];

async function setupDatabase() {
  try {
    console.log('🚀 Starting DevDost database setup...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define schemas
    const ProjectSchema = new mongoose.Schema({
      title: String,
      description: String,
      techStack: [String],
      category: String,
      difficulty: String,
      estimatedDuration: String,
      createdBy: String,
      isPredefined: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      features: [String],
      learningOutcomes: [String],
      requiredSkills: [String]
    }, { timestamps: true });

    const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

    // Check if projects already exist
    const existingCount = await Project.countDocuments({ isPredefined: true });
    
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing predefined projects`);
      return;
    }

    // Insert predefined projects
    const result = await Project.insertMany(predefinedProjects);
    console.log(`✅ Successfully created ${result.length} predefined projects`);

    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

setupDatabase();