"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

const ERROR_MESSAGES = {
  'OAuthAccountNotLinked': {
    title: 'Account Linking Issue',
    description: 'There was a problem linking your Google account. This usually happens when an account with the same email already exists.',
    solutions: [
      'Try signing in again with Google',
      'Clear your browser data and try again',
      'Make sure you\'re using the same Google account',
      'Contact support if the issue persists'
    ]
  },
  'OAuthSignin': {
    title: 'Sign-in Error',
    description: 'There was an error during the OAuth sign-in process.',
    solutions: [
      'Check your internet connection',
      'Try signing in again',
      'Clear browser cookies and cache',
      'Disable ad blockers temporarily'
    ]
  },
  'OAuthCallback': {
    title: 'Callback Error',
    description: 'There was an error in the OAuth callback process.',
    solutions: [
      'Try the sign-in process again',
      'Check if third-party cookies are enabled',
      'Clear your browser cache',
      'Try using an incognito/private window'
    ]
  },
  'default': {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication.',
    solutions: [
      'Try signing in again',
      'Clear your browser data',
      'Check your internet connection',
      'Try using a different browser'
    ]
  }
};

export default function AuthErrorPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (router.query.error) {
      setError(router.query.error as string);
    }
  }, [router.query.error]);

  const errorInfo = ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;

  const clearBrowserData = () => {
    setIsClearing(true);
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Show instructions for manual clearing
    setTimeout(() => {
      setIsClearing(false);
      alert(`Please manually clear your browser cookies and cache:

Chrome/Edge: Ctrl+Shift+Del
Firefox: Ctrl+Shift+Del
Safari: Cmd+Option+E

Then try signing in again.`);
    }, 1000);
  };

  const retrySignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${(i * 30) % 100}%`,
              top: `${(i * 25) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Error Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-red-500/30 shadow-2xl"
        >
          {/* Error Icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl mb-4"
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {errorInfo.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-lg"
            >
              {errorInfo.description}
            </motion.p>
          </div>

          {/* Error Details */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
            >
              <h3 className="text-red-200 font-medium mb-2">Error Code:</h3>
              <code className="text-red-100 text-sm bg-red-500/20 px-2 py-1 rounded">
                {error}
              </code>
            </motion.div>
          )}

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-white text-lg font-semibold mb-4">
              💡 Try these solutions:
            </h3>
            <div className="space-y-3">
              {errorInfo.solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
                  <span>{solution}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={retrySignIn}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex-1"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={clearBrowserData}
              disabled={isClearing}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex-1"
            >
              {isClearing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              <span>{isClearing ? 'Clearing...' : 'Clear Browser Data'}</span>
            </button>

            <Link
              href="/"
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex-1"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t border-white/10 text-center"
          >
            <p className="text-gray-400 text-sm mb-4">
              Still having trouble? Here are some additional steps:
            </p>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Try using an incognito/private browsing window</p>
              <p>• Check if JavaScript is enabled in your browser</p>
              <p>• Temporarily disable browser extensions</p>
              <p>• Make sure your system date and time are correct</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center text-gray-400 text-sm mt-8"
        >
          Need more help? Contact our support team at{" "}
          <a 
            href="mailto:support@devdost.com" 
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            support@devdost.com
          </a>
        </motion.p>
      </div>
    </div>
  );
}