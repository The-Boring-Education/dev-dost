# DevDost - Tinder for Builders 🚀

![DevDost Logo](https://github.com/The-Boring-Education/DevDost/blob/main/public/logo.png?raw=true)

**Find your dev partner. Swipe right on projects. Build amazing things together.**

DevDost is a revolutionary platform that connects developers across different cities through project-based matching. Like Tinder, but for building awesome projects together!

## ✨ Features

### 🎯 Core Functionality
- **Tinder-like Interface**: Swipe right on projects you're interested in, left to skip
- **Smart Matching**: When two developers both swipe right on the same project, they get matched
- **Project Discovery**: Browse through curated project ideas across different categories
- **Real-time Matching**: Instant notifications when you find your development partner

### 🛠️ Tech Categories
- **Full Stack**: End-to-end web applications
- **Frontend**: UI/UX focused projects
- **Backend**: Server-side and API development
- **Mobile**: iOS and Android applications
- **Data Science**: Analytics and insights projects
- **Machine Learning**: AI-powered applications
- **Blockchain**: Decentralized applications
- **DevOps**: Infrastructure and deployment tools

### 👥 Social Features
- **Profile Management**: Showcase your skills and experience
- **Match Dashboard**: View all your project matches in one place
- **Contact Integration**: Connect via WhatsApp, Telegram, or Email
- **Project Creation**: Create and share your own project ideas

### 🎨 User Experience
- **Beautiful UI**: Modern, animated interface with Framer Motion
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Theme**: Eye-friendly design with gradient backgrounds
- **Smooth Animations**: Delightful micro-interactions throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/The-Boring-Education/DevDost.git
   cd DevDost
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Google OAuth (provided in project)
   GOOGLE_CLIENT_ID=183084025505-e5k0j4hnjivmncjgttllad7iicqou82t.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/devdost
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Seed the database with projects**
   ```bash
   npm run dev  # Start the dev server first
   npm run seed # In another terminal
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
dev-dost/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Main swipe interface
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Footer.tsx        # Site footer
│   │   ├── ProjectCard.tsx   # Tinder-style card
│   │   └── Providers.tsx     # Context providers
│   ├── lib/
│   │   ├── mongodb.ts        # Database connection
│   │   └── seedData.ts       # Predefined projects
│   ├── models/               # MongoDB schemas
│   │   ├── User.ts
│   │   ├── Project.ts
│   │   ├── ProjectInterest.ts
│   │   └── Match.ts
│   └── types/
│       └── next-auth.d.ts    # Type extensions
├── public/                   # Static assets
├── scripts/
│   └── setup.js             # Database setup script
└── package.json
```

## 🎮 How to Use

### For Users

1. **Sign Up**: Use Google OAuth to create your account
2. **Complete Profile**: Add your skills, experience, and contact preferences
3. **Start Swiping**: Browse project cards and swipe right on interesting ones
4. **Get Matched**: When someone else also likes your project choice, you match!
5. **Connect**: Use the provided contact information to start collaborating

### For Developers

1. **API Routes**: All endpoints are in `src/app/api/`
2. **Database Models**: Mongoose schemas in `src/models/`
3. **Components**: Reusable UI components in `src/components/`
4. **Authentication**: NextAuth.js with Google provider

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and gestures
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Serverless functions
- **NextAuth.js**: Authentication with Google OAuth
- **MongoDB**: Document database
- **Mongoose**: ODM for MongoDB

### Development
- **ESLint**: Code linting
- **Turbopack**: Fast bundler
- **Hot Reload**: Instant development feedback

## 🎯 API Endpoints

### Projects
- `GET /api/projects/for-user` - Get projects for current user
- `POST /api/projects/swipe` - Record swipe and check for matches
- `POST /api/seed` - Seed database with predefined projects

### User
- `GET /api/user/stats` - Get user statistics

### Authentication
- `POST /api/auth/signin` - Google OAuth sign in
- `POST /api/auth/signout` - Sign out

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy!

### Environment Variables for Production
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Write TypeScript for type safety
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

## 📊 Database Schema

### Users
- Profile information and preferences
- Skills and experience level
- Contact preferences (WhatsApp, Telegram, Email)

### Projects
- Title, description, and requirements
- Technology stack and difficulty level
- Predefined vs user-created projects

### ProjectInterests
- User swipe history (left/right)
- Tracking interests for matching

### Matches
- Successful matches between users
- Project they both liked
- Match status and communication

## 🎨 Design System

### Colors
- **Primary**: Purple to Pink gradients
- **Secondary**: Blue tones
- **Accent**: Green for success, Red for actions
- **Background**: Dark gradients with transparency

### Typography
- **Font**: Inter (clean and modern)
- **Headings**: Bold weights for impact
- **Body**: Regular weights for readability

### Components
- **Cards**: Rounded corners with glassmorphism
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states

## 🔮 Future Features

- [ ] **Video Profiles**: Record introduction videos
- [ ] **Project Templates**: Ready-to-use project structures
- [ ] **Team Formation**: Build teams of 3+ developers
- [ ] **Progress Tracking**: Monitor project development
- [ ] **Skill Assessment**: Automated skill verification
- [ ] **Mentorship**: Connect with experienced developers
- [ ] **Project Showcase**: Display completed projects
- [ ] **AI Recommendations**: Smart project suggestions

## 📱 Mobile App

Coming soon! We're planning React Native apps for iOS and Android.

## 🐛 Known Issues

- [ ] Avatar images need proper handling for all providers
- [ ] Email notifications for matches
- [ ] Advanced filtering options
- [ ] Undo swipe functionality

## 📞 Support

- **Website**: [theboringeducation.com](https://theboringeducation.com)
- **Email**: Contact through our website
- **Instagram**: [@theboringeducation](https://instagram.com/theboringeducation)
- **GitHub**: [The-Boring-Education](https://github.com/The-Boring-Education)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Boring Education** - For the vision and platform
- **Next.js Team** - For the amazing framework
- **Vercel** - For seamless deployment
- **MongoDB** - For reliable data storage
- **All Contributors** - For making this project better

---

**Built with ❤️ in 🇮🇳**

Ready to find your dev partner? Let's build something amazing together! 🚀

[**Get Started →**](https://devdost.com)
