"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { StatsCard } from "@/components/StatsCard";
import { Heart, X, RotateCcw, Users, Target, Trophy, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  difficulty: string;
  estimatedDuration: string;
  features: string[];
  learningOutcomes: string[];
  requiredSkills: string[];
}

interface UserStats {
  totalProjects: number;
  interestedCount: number;
  matchesCount: number;
  pendingMatches: number;
  activeMatches: number;
  profileCompleted: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwipeLoading, setIsSwipeLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session && !session.user.profileCompleted) {
      router.push("/profile/setup");
      return;
    }

    if (session) {
      fetchProjects();
      fetchStats();
    }
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects/for-user");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
        if (data.projects.length === 0) {
          toast("You've seen all available projects! 🎉\nCheck back later for new ones.", {
            duration: 5000,
          });
        }
      } else {
        toast.error("Failed to load projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSwipe = async (projectId: string, interested: boolean) => {
    setIsSwipeLoading(true);
    try {
      const response = await fetch("/api/projects/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          interested,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.match) {
          toast.success(
            `🎉 Match found!\nYou and ${data.match.otherUserName} both want to build "${data.match.projectTitle}"!\nConnect via their contact info.`,
            { duration: 8000 }
          );
        } else {
          toast.success(interested ? "Swiped right! 💫" : "Swiped left! 👈");
        }

        // Move to next project
        setCurrentProjectIndex(prev => prev + 1);
        
        // Update stats
        fetchStats();
      } else {
        toast.error("Failed to record swipe");
      }
    } catch (error) {
      console.error("Error swiping:", error);
      toast.error("Failed to record swipe");
    } finally {
      setIsSwipeLoading(false);
    }
  };

  const resetProjects = async () => {
    setIsLoading(true);
    setCurrentProjectIndex(0);
    await fetchProjects();
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const currentProject = projects[currentProjectIndex];
  const hasMoreProjects = currentProjectIndex < projects.length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome back, {session.user.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to find your next dev partner? Swipe through exciting projects and discover your perfect match!
            </p>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <StatsCard
                icon={<Target className="w-6 h-6" />}
                label="Projects Seen"
                value={stats.totalProjects}
                gradient="from-blue-500 to-purple-600"
              />
              <StatsCard
                icon={<Heart className="w-6 h-6" />}
                label="Interested In"
                value={stats.interestedCount}
                gradient="from-pink-500 to-red-500"
              />
              <StatsCard
                icon={<Users className="w-6 h-6" />}
                label="Matches"
                value={stats.matchesCount}
                gradient="from-green-500 to-teal-500"
              />
              <StatsCard
                icon={<Trophy className="w-6 h-6" />}
                label="Active Projects"
                value={stats.activeMatches}
                gradient="from-yellow-500 to-orange-500"
              />
            </motion.div>
          )}
        </div>

        {/* Project Swipe Area */}
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {hasMoreProjects && currentProject ? (
              <motion.div
                key={currentProject._id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -200 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <ProjectCard
                  project={currentProject}
                  onSwipe={(projectId, direction) => handleSwipe(projectId, direction === 'right')}
                  onCardRemove={() => setCurrentProjectIndex(prev => prev + 1)}
                  isTopCard={true}
                />

                {/* Swipe Controls */}
                <div className="flex justify-center space-x-6 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe(currentProject._id, false)}
                    disabled={isSwipeLoading}
                    className="bg-white/10 hover:bg-red-500/20 border-2 border-white/20 hover:border-red-500/50 text-white p-4 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    <X className="w-8 h-8" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe(currentProject._id, true)}
                    disabled={isSwipeLoading}
                    className="bg-white/10 hover:bg-green-500/20 border-2 border-white/20 hover:border-green-500/50 text-white p-4 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    <Heart className="w-8 h-8" />
                  </motion.button>
                </div>

                <p className="text-center text-gray-400 text-sm mt-4">
                  Swipe left to pass, right to show interest
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-6"
                  >
                    <Zap className="w-16 h-16 text-yellow-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4">
                    You're all caught up! 🎉
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    You've seen all available projects. Check back later for new exciting opportunities, 
                    or refresh to see if we have more projects available.
                  </p>
                  
                  <div className="space-y-4">
                    <button
                      onClick={resetProjects}
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 mx-auto disabled:opacity-50"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>{isLoading ? 'Loading...' : 'Refresh Projects'}</span>
                    </button>
                    
                    <p className="text-gray-400 text-sm">
                      Projects remaining: {projects.length - currentProjectIndex}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              💡 Pro Tips for Better Matches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-500 rounded-full p-1 mt-1">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Swipe Smart</h4>
                    <p className="text-gray-300 text-sm">Only swipe right on projects you're genuinely excited about.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 rounded-full p-1 mt-1">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Be Responsive</h4>
                    <p className="text-gray-300 text-sm">When you match, reach out quickly to start the conversation.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Define Goals</h4>
                    <p className="text-gray-300 text-sm">Discuss project scope and timeline early in your conversation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-500 rounded-full p-1 mt-1">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Start Small</h4>
                    <p className="text-gray-300 text-sm">Begin with a smaller feature to test your collaboration style.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}