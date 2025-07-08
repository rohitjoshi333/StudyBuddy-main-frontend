import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, 
  Users, 
  FileText, 
  UserPlus,
  Calendar,
  Award
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'message' | 'workspace' | 'file' | 'match' | 'event' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

const ActivityFeed: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'match',
      title: 'New Study Partner Match',
      description: 'You matched with Alex Chen for Mathematics study group',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      user: {
        name: 'Alex Chen',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      description: 'Emma sent a message in AI Study Group workspace',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: '3',
      type: 'file',
      title: 'File Shared',
      description: 'Machine Learning Notes.pdf uploaded to AI Study Group',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: '4',
      type: 'workspace',
      title: 'Workspace Created',
      description: 'Biology Research Group workspace created',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      description: 'Earned "Collaborative Learner" badge for 10 study sessions',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return MessageCircle;
      case 'workspace':
        return Users;
      case 'file':
        return FileText;
      case 'match':
        return UserPlus;
      case 'event':
        return Calendar;
      case 'achievement':
        return Award;
      default:
        return MessageCircle;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'workspace':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'file':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'match':
        return 'text-pink-500 bg-pink-100 dark:bg-pink-900/20';
      case 'event':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'achievement':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.description}
                  </p>
                  
                  {activity.user && (
                    <div className="flex items-center mt-2">
                      {activity.user.avatar ? (
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {activity.user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {activity.user.name}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;