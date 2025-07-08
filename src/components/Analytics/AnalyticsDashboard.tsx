import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Calendar,
  Users,
  MessageCircle,
  BookOpen,
  Filter
} from 'lucide-react';
import { Analytics } from '../../types';
import { useApp } from '../../contexts/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard: React.FC = () => {
  const { analytics } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'studyTime' | 'tasks' | 'collaborations'>('studyTime');

  // Mock data for charts
  const studyTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: [2.5, 3.2, 1.8, 4.1, 2.9, 1.5, 3.7],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const taskCompletionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 22],
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
      },
    ],
  };

  const collaborationData = {
    labels: ['Study Groups', 'Pair Sessions', 'Workspace Projects', 'Video Calls'],
    datasets: [
      {
        data: [35, 25, 25, 15],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const stats = [
    {
      title: 'Total Study Time',
      value: '24.5h',
      change: '+12%',
      isPositive: true,
      icon: Clock,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Tasks Completed',
      value: '68',
      change: '+8%',
      isPositive: true,
      icon: Target,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Collaborations',
      value: '15',
      change: '+25%',
      isPositive: true,
      icon: Users,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'XP Earned',
      value: '2,450',
      change: '+18%',
      isPositive: true,
      icon: Award,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  const achievements = [
    {
      name: 'Study Streak',
      description: '7 days in a row',
      progress: 70,
      icon: '🔥',
      color: 'bg-red-500'
    },
    {
      name: 'Collaboration Master',
      description: '10 successful partnerships',
      progress: 80,
      icon: '🤝',
      color: 'bg-blue-500'
    },
    {
      name: 'Task Crusher',
      description: '50 tasks completed',
      progress: 90,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      name: 'Knowledge Sharer',
      description: '100 messages sent',
      progress: 60,
      icon: '💬',
      color: 'bg-purple-500'
    }
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress and achievements
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>{stat.change}</span>
                  <span className="text-gray-500 ml-2">vs last {timeRange}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Study Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Study Time Trends
            </h3>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Hours per day</span>
            </div>
          </div>
          <Line data={studyTimeData} options={chartOptions} />
        </motion.div>

        {/* Task Completion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Task Completion
            </h3>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Tasks per week</span>
            </div>
          </div>
          <Bar data={taskCompletionData} options={chartOptions} />
        </motion.div>

        {/* Collaboration Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Collaboration Types
            </h3>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Distribution</span>
            </div>
          </div>
          <div className="h-64">
            <Doughnut 
              data={collaborationData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} 
            />
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Achievement Progress
            </h3>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Badges</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={achievement.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {achievement.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {achievement.progress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    className={`h-2 rounded-full ${achievement.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Heatmap
          </h3>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Last 12 months</span>
          </div>
        </div>
        
        <div className="grid grid-cols-53 gap-1">
          {Array.from({ length: 365 }, (_, i) => {
            const intensity = Math.random();
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  intensity > 0.8 ? 'bg-primary-500' :
                  intensity > 0.6 ? 'bg-primary-400' :
                  intensity > 0.4 ? 'bg-primary-300' :
                  intensity > 0.2 ? 'bg-primary-200' :
                  'bg-gray-200 dark:bg-gray-700'
                }`}
                title={`Activity level: ${Math.round(intensity * 100)}%`}
              />
            );
          })}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm" />
            <div className="w-3 h-3 bg-primary-200 rounded-sm" />
            <div className="w-3 h-3 bg-primary-300 rounded-sm" />
            <div className="w-3 h-3 bg-primary-400 rounded-sm" />
            <div className="w-3 h-3 bg-primary-500 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;