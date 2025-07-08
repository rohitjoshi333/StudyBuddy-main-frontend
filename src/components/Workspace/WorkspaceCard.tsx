import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  FileText, 
  Calendar,
  Settings,
  Star,
  Lock,
  Globe,
  Video,
  Bot
} from 'lucide-react';
import { Workspace } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface WorkspaceCardProps {
  workspace: Workspace;
  onJoin?: (id: string) => void;
  onOpen?: (id: string) => void;
  isOwner?: boolean;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ 
  workspace, 
  onJoin, 
  onOpen,
  isOwner = false 
}) => {
  const handleClick = () => {
    if (onOpen) {
      onOpen(workspace.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {workspace.name}
              </h3>
              {workspace.isPrivate ? (
                <Lock className="h-4 w-4 text-gray-400" />
              ) : (
                <Globe className="h-4 w-4 text-green-500" />
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
              {workspace.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs">
                {workspace.category}
              </span>
              <span>
                {formatDistanceToNow(workspace.lastActivity, { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle settings
              }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {workspace.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {workspace.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{workspace.tags.length - 3}
            </span>
          )}
        </div>

        {/* Members */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {workspace.members.slice(0, 4).map((member, index) => (
                <div key={member.id} className="relative">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {workspace.memberCount > 4 && (
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold">
                    +{workspace.memberCount - 4}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {workspace.memberCount} members
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Chat</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">{workspace.files.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Events</span>
            </div>
            {workspace.settings.videoCallsEnabled && (
              <div className="flex items-center space-x-1">
                <Video className="h-4 w-4" />
                <span className="text-xs">Calls</span>
              </div>
            )}
            {workspace.aiEnabled && (
              <div className="flex items-center space-x-1">
                <Bot className="h-4 w-4 text-purple-500" />
                <span className="text-xs">AI</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex space-x-2">
          {onJoin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoin(workspace.id);
              }}
              className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Join Workspace
            </button>
          )}
          
          <button
            onClick={handleClick}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkspaceCard;