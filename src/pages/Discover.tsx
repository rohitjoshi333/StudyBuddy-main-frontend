import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Users, MapPin, Clock, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import MatchCard from '../components/Discover/MatchCard';

const Discover: React.FC = () => {
  const { matches, updateMatchStatus } = useApp();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filters, setFilters] = useState({
    course: '',
    year: '',
    interests: '',
    studyStyle: ''
  });

  const pendingMatches = matches.filter(match => match.status === 'pending');
  const currentMatch = pendingMatches[currentMatchIndex];

  const handleAccept = (matchId: string) => {
    updateMatchStatus(matchId, 'matched');
    nextMatch();
  };

  const handleReject = (matchId: string) => {
    updateMatchStatus(matchId, 'rejected');
    nextMatch();
  };

  const nextMatch = () => {
    if (currentMatchIndex < pendingMatches.length - 1) {
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      setCurrentMatchIndex(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Study Partners
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find students who match your interests and study goals
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              List
            </button>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or interests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={filters.course}
            onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Courses</option>
            <option value="computer-science">Computer Science</option>
            <option value="mathematics">Mathematics</option>
            <option value="biology">Biology</option>
            <option value="physics">Physics</option>
          </select>
          
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Years</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
          
          <select
            value={filters.studyStyle}
            onChange={(e) => setFilters(prev => ({ ...prev, studyStyle: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Study Style</option>
            <option value="solo">Solo</option>
            <option value="pair">Pair</option>
            <option value="group">Group</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {currentMatch ? (
              <MatchCard
                key={currentMatch.id}
                match={currentMatch}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center max-w-md"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No more matches!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new study partners or update your preferences.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {match.user.avatar ? (
                    <img
                      src={match.user.avatar}
                      alt={match.user.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {match.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {match.user.name}
                      </h3>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {match.matchPercentage}% match
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{match.user.course} • {match.user.year}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{match.user.university}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        <span>{match.user.rating} rating</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-2">
                      {match.user.bio}
                    </p>
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleReject(match.id)}
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => handleAccept(match.id)}
                        className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;