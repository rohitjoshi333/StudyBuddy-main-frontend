import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Folder, 
  TrendingUp,
  Calendar,
  Bell,
  BookOpen,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import StatsCard from '../components/Dashboard/StatsCard';
import ActivityFeed from '../components/Dashboard/ActivityFeed';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { matches, workspaces, notifications } = useApp();

  const stats = [
    {
      title: 'Study Partners',
      value: matches.filter(m => m.status === 'matched').length,
      icon: Users,
      color: 'primary' as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Active Workspaces',
      value: workspaces.length,
      icon: Folder,
      color: 'secondary' as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Messages',
      value: 47,
      icon: MessageCircle,
      color: 'accent' as const,
      trend: { value: 23, isPositive: true }
    },
    {
      title: 'Study Hours',
      value: '24h',
      icon: BookOpen,
      color: 'success' as const,
      trend: { value: 15, isPositive: true }
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'AI Study Session',
      time: '2:00 PM',
      workspace: 'AI Study Group',
      participants: 4
    },
    {
      id: '2',
      title: 'Math Problem Solving',
      time: '4:30 PM',
      workspace: 'Mathematics Hub',
      participants: 3
    },
    {
      id: '3',
      title: 'Project Review',
      time: '6:00 PM',
      workspace: 'Web Dev Collaboration',
      participants: 5
    }
  ];

  const recentMatches = matches.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              You have {notifications.filter(n => !n.isRead).length} new notifications and {matches.filter(m => m.status === 'pending').length} potential study partners waiting.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Target className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  New Study Partner Matches
                </h3>
                <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View all
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    {match.user.avatar ? (
                      <img
                        src={match.user.avatar}
                        alt={match.user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {match.user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {match.user.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {match.user.course} • {match.matchPercentage}% match
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors">
                        Connect
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Today's Schedule
                  </h3>
                </div>
                <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View calendar
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {event.time.split(':')[0]}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        :{event.time.split(':')[1].split(' ')[0]}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.workspace} • {event.participants} participants
                      </p>
                    </div>
                    
                    <button className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors">
                      Join
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ActivityFeed />
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                <Users className="h-5 w-5" />
                <span className="font-medium">Find Study Partners</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-900/40 transition-colors">
                <Folder className="h-5 w-5" />
                <span className="font-medium">Create Workspace</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-900/40 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Start Conversation</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;