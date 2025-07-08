import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X, MapPin, Clock, Star, Users } from 'lucide-react';
import { Match } from '../../types';

interface MatchCardProps {
  match: Match;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onAccept, onReject }) => {
  const { user, matchPercentage, commonInterests } = match;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-sm mx-auto"
    >
      {/* Profile Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary-400 to-secondary-400">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Match Percentage Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white font-semibold text-sm">{matchPercentage}% match</span>
        </div>

        {/* Online Status */}
        <div className="absolute bottom-4 left-4">
          <div className={`flex items-center space-x-2 ${
            user.isOnline ? 'text-green-400' : 'text-gray-400'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              user.isOnline ? 'bg-green-400' : 'bg-gray-400'
            }`} />
            <span className="text-white text-sm font-medium">
              {user.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{user.course} • {user.year}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {user.rating}
            </span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{user.university}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {user.bio}
        </p>

        {/* Common Interests */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Common Interests
          </h4>
          <div className="flex flex-wrap gap-2">
            {commonInterests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
            {commonInterests.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{commonInterests.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Study Preferences */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span className="capitalize">{user.studyStyle}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{user.availability.timeSlots[0] || 'Flexible'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReject(match.id)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
          >
            <X className="h-5 w-5 mr-2" />
            Pass
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAccept(match.id)}
            className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center"
          >
            <Heart className="h-5 w-5 mr-2" />
            Connect
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;