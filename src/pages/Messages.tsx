import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, MessageCircle, Users, Video, Phone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import ChatInterface from '../components/Chat/ChatInterface';
import { Chat, User } from '../types';
import { formatDistanceToNow } from 'date-fns';

const Messages: React.FC = () => {
  const { chats } = useApp();
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'direct' | 'workspace' | 'group'>('all');

  // Mock chats data
  const mockChats: Chat[] = [
    {
      id: 'chat-1',
      type: 'direct',
      participants: [
        {
          id: '2',
          name: 'Alex Chen',
          email: 'alex@mit.edu',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'Full-stack developer',
          course: 'JavaScript, React, Node.js',
          year: '3rd Year',
          university: 'MIT',
          interests: ['Web Development'],
          skills: ['JavaScript'],
          studyStyle: 'pair',
          availability: { days: [], timeSlots: [] },
          preferences: { studyEnvironment: [], goals: [] },
          isOnline: true,
          lastSeen: new Date(),
          rating: 4.9,
          totalCollaborations: 12,
          xp: 2450,
          level: 5,
          badges: [],
          streak: 7,
          timezone: 'UTC-8',
          language: 'en',
          isVerified: true
        }
      ],
      messages: [
        {
          id: 'msg-1',
          senderId: '2',
          senderName: 'Alex Chen',
          senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Hey! Ready for our React study session?',
          type: 'text',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false,
          reactions: [],
          edited: false
        }
      ],
      lastMessage: {
        id: 'msg-1',
        senderId: '2',
        senderName: 'Alex Chen',
        senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Hey! Ready for our React study session?',
        type: 'text',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        reactions: [],
        edited: false
      },
      unreadCount: 1,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isTyping: [],
      pinnedMessages: [],
      settings: {
        notifications: true,
        soundEnabled: true,
        theme: 'auto',
        fontSize: 'medium'
      }
    },
    {
      id: 'chat-2',
      type: 'workspace',
      participants: [
        {
          id: '3',
          name: 'Emma Rodriguez',
          email: 'emma@stanford.edu',
          avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'Data science enthusiast',
          course: 'Python, Machine Learning',
          year: '4th Year',
          university: 'Stanford University',
          interests: ['Data Science'],
          skills: ['Python'],
          studyStyle: 'group',
          availability: { days: [], timeSlots: [] },
          preferences: { studyEnvironment: [], goals: [] },
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
          rating: 4.7,
          totalCollaborations: 18,
          xp: 3200,
          level: 7,
          badges: [],
          streak: 12,
          timezone: 'UTC-8',
          language: 'en',
          isVerified: true
        },
        {
          id: '4',
          name: 'Marcus Johnson',
          email: 'marcus@harvard.edu',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
          bio: 'Mobile app developer',
          course: 'React Native, Flutter',
          year: '2nd Year',
          university: 'Harvard University',
          interests: ['Mobile Development'],
          skills: ['React Native'],
          studyStyle: 'group',
          availability: { days: [], timeSlots: [] },
          preferences: { studyEnvironment: [], goals: [] },
          isOnline: true,
          lastSeen: new Date(),
          rating: 4.8,
          totalCollaborations: 8,
          xp: 1800,
          level: 4,
          badges: [],
          streak: 5,
          timezone: 'UTC-8',
          language: 'en',
          isVerified: true
        }
      ],
      workspaceId: 'ws-1',
      messages: [
        {
          id: 'msg-2',
          senderId: '3',
          senderName: 'Emma Rodriguez',
          senderAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'I uploaded the ML dataset to our workspace',
          type: 'text',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: true,
          reactions: [],
          edited: false
        }
      ],
      lastMessage: {
        id: 'msg-2',
        senderId: '3',
        senderName: 'Emma Rodriguez',
        senderAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'I uploaded the ML dataset to our workspace',
        type: 'text',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: true,
        reactions: [],
        edited: false
      },
      unreadCount: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isTyping: [],
      pinnedMessages: [],
      settings: {
        notifications: true,
        soundEnabled: true,
        theme: 'auto',
        fontSize: 'medium'
      }
    }
  ];
  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || (chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || chat.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getChatName = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== user?.id);
      return otherParticipant?.name || 'Unknown';
    }
    return `${chat.participants.length} members`;
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== user?.id);
      return otherParticipant?.avatar;
    }
    return null;
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <button className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2">
            {(['all', 'direct', 'workspace', 'group'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            <div className="space-y-1 p-2">
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {chat.type === 'direct' ? (
                        <>
                          {getChatAvatar(chat) ? (
                            <img
                              src={getChatAvatar(chat)}
                              alt={getChatName(chat)}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {getChatName(chat).charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Online indicator */}
                          {chat.participants.some(p => p.id !== user?.id && isUserOnline(p.id)) && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </>
                      ) : (
                        <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          {chat.type === 'workspace' ? (
                            <Users className="h-6 w-6 text-white" />
                          ) : (
                            <MessageCircle className="h-6 w-6 text-white" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {getChatName(chat)}
                        </h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {chat.lastMessage.senderId === user?.id ? 'You' : chat.lastMessage.senderName}: {chat.lastMessage.content}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {chat.type === 'workspace' && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                              Workspace
                            </span>
                          )}
                          {chat.type === 'group' && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                              Group
                            </span>
                          )}
                        </div>
                        
                        {chat.unreadCount > 0 && (
                          <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium mb-2">No conversations found</p>
              <p className="text-sm text-center">
                {searchQuery ? 'Try adjusting your search' : 'Start a new conversation to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatInterface 
            chat={selectedChat} 
            onClose={() => setSelectedChat(null)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-lg mb-6">Choose a chat from the sidebar to start messaging</p>
              
              <div className="flex items-center justify-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>New Chat</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Video className="h-4 w-4" />
                  <span>Start Call</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;