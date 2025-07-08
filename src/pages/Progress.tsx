import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  BookOpen,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CalendarView from '../components/Calendar/CalendarView';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'skill' | 'project' | 'certification';
  targetDate: Date;
  progress: number;
  isCompleted: boolean;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
}

const Progress: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'calendar' | 'analytics'>('overview');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'academic' as Goal['category'],
    targetDate: '',
    milestones: ['']
  });

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Master React Development',
      description: 'Complete advanced React course and build 3 projects',
      category: 'skill',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      progress: 75,
      isCompleted: false,
      milestones: [
        { id: '1', title: 'Complete React Hooks', isCompleted: true, completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { id: '2', title: 'Build Todo App', isCompleted: true, completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { id: '3', title: 'Learn Context API', isCompleted: false },
        { id: '4', title: 'Build E-commerce Project', isCompleted: false }
      ]
    },
    {
      id: '2',
      title: 'Complete Data Structures Course',
      description: 'Finish CS50 and solve 100 LeetCode problems',
      category: 'academic',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      progress: 45,
      isCompleted: false,
      milestones: [
        { id: '1', title: 'Arrays and Strings', isCompleted: true },
        { id: '2', title: 'Linked Lists', isCompleted: true },
        { id: '3', title: 'Trees and Graphs', isCompleted: false },
        { id: '4', title: 'Dynamic Programming', isCompleted: false }
      ]
    },
    {
      id: '3',
      title: 'AWS Cloud Practitioner',
      description: 'Get AWS Cloud Practitioner certification',
      category: 'certification',
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      progress: 30,
      isCompleted: false,
      milestones: [
        { id: '1', title: 'Complete AWS Course', isCompleted: false },
        { id: '2', title: 'Practice Tests', isCompleted: false },
        { id: '3', title: 'Schedule Exam', isCompleted: false }
      ]
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetDate: new Date(newGoal.targetDate),
      progress: 0,
      isCompleted: false,
      milestones: newGoal.milestones
        .filter(m => m.trim())
        .map((title, index) => ({
          id: `milestone-${Date.now()}-${index}`,
          title,
          isCompleted: false
        }))
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'academic',
      targetDate: '',
      milestones: ['']
    });
    setShowCreateGoal(false);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return {
              ...milestone,
              isCompleted: !milestone.isCompleted,
              completedAt: !milestone.isCompleted ? new Date() : undefined
            };
          }
          return milestone;
        });
        
        const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          isCompleted: progress === 100
        };
      }
      return goal;
    }));
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'skill': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'project': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'certification': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const overviewStats = {
    totalGoals: goals.length,
    completedGoals: goals.filter(g => g.isCompleted).length,
    averageProgress: Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length),
    totalMilestones: goals.reduce((sum, goal) => sum + goal.milestones.length, 0),
    completedMilestones: goals.reduce((sum, goal) => sum + goal.milestones.filter(m => m.isCompleted).length, 0)
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Progress Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning goals and monitor your academic progress
          </p>
        </div>
        
        {activeTab === 'goals' && (
          <button
            onClick={() => setShowCreateGoal(true)}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {overviewStats.totalGoals}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {overviewStats.completedGoals}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {overviewStats.averageProgress}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Milestones</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {overviewStats.completedMilestones}/{overviewStats.totalMilestones}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Active Goals
            </h3>
            <div className="space-y-4">
              {goals.filter(goal => !goal.isCompleted).slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.progress}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getDaysRemaining(goal.targetDate)} days left
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {goal.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                    {goal.isCompleted && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-full text-xs">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{goal.description}</p>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Due: {goal.targetDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getDaysRemaining(goal.targetDate)} days remaining
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Milestones */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleMilestone(goal.id, milestone.id)}
                        className="flex-shrink-0"
                      >
                        {milestone.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <span className={`text-sm ${
                        milestone.isCompleted 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {milestone.title}
                      </span>
                      {milestone.completedAt && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Completed {milestone.completedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'analytics' && <AnalyticsDashboard />}

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Goal
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter goal title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your goal..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="academic">Academic</option>
                    <option value="skill">Skill</option>
                    <option value="project">Project</option>
                    <option value="certification">Certification</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Milestones
                </label>
                {newGoal.milestones.map((milestone, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={milestone}
                      onChange={(e) => {
                        const updated = [...newGoal.milestones];
                        updated[index] = e.target.value;
                        setNewGoal(prev => ({ ...prev, milestones: updated }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={`Milestone ${index + 1}...`}
                    />
                    {index === newGoal.milestones.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setNewGoal(prev => ({ ...prev, milestones: [...prev.milestones, ''] }))}
                        className="px-3 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateGoal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Progress;