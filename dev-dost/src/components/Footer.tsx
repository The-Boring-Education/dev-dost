"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Instagram, Github, BookOpen, Users } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white">DevDost</h3>
                <p className="text-sm text-gray-300 -mt-1">by The Boring Education</p>
              </div>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-center md:text-left font-medium"
            >
              🚀 Tinder for Builders
            </motion.p>
            <p className="text-gray-400 text-sm text-center md:text-left mt-2">
              Connect. Build. Ship together.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <div className="space-y-3">
              <motion.a
                href="https://www.theboringeducation.com/shiksha"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <BookOpen className="w-4 h-4" />
                <span>Free Courses</span>
              </motion.a>
              <motion.a
                href="https://www.theboringeducation.com/interview-prep"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Users className="w-4 h-4" />
                <span>Interview Prep</span>
              </motion.a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <motion.a
                href="https://www.instagram.com/theboringeducation"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </motion.a>
              <motion.a
                href="https://github.com/The-Boring-Education"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 DevDost by The Boring Education. All rights reserved.
          </p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 text-sm mt-4 md:mt-0 flex items-center space-x-1"
          >
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 mx-1" />
            <span>in</span>
            <span className="text-lg">🇮🇳</span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}