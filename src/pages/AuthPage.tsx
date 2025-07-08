import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Study Partner
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Connect with fellow students, join study groups, and collaborate on projects. 
              Make learning more engaging and effective together.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Smart matching based on interests and goals</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/20 rounded-full flex items-center justify-center">
                  <span className="text-secondary-600 dark:text-secondary-400 font-bold">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Real-time messaging and collaboration tools</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center">
                  <span className="text-accent-600 dark:text-accent-400 font-bold">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Shared workspaces for group projects</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth forms */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm key="login" onToggleMode={() => setIsLogin(false)} />
            ) : (
              <RegisterForm key="register" onToggleMode={() => setIsLogin(true)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;