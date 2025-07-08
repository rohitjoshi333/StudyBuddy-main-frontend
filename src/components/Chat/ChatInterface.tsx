import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Reply,
  Edit,
  Trash2,
  Pin,
  Search
} from 'lucide-react';
import { Chat, Message, User } from '../../types';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import EmojiPicker from 'emoji-picker-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  chat: Chat;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, onClose }) => {
  const { user } = useAuth();
  const { sendMessage, startTyping, stopTyping, typingUsers, startVideoCall } = useSocket();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const newMessage: Omit<Message, 'id' | 'timestamp'> = {
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      content: message,
      type: 'text',
      isRead: false,
      reactions: [],
      replyTo: replyTo?.id,
      edited: false
    };

    sendMessage(chat.id, newMessage);
    setMessage('');
    setReplyTo(null);
    stopTyping(chat.id);
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (value.trim()) {
      startTyping(chat.id);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(chat.id);
      }, 1000);
    } else {
      stopTyping(chat.id);
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // Handle message reactions
    console.log('React to message:', messageId, emoji);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    if (chat.workspaceId) {
      const participants = chat.participants.map(p => p.id);
      startVideoCall(chat.workspaceId, participants);
    }
  };

  const filteredMessages = chat.messages.filter(msg =>
    searchQuery === '' || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTypingUsers = typingUsers[chat.id] || [];
  const otherTypingUsers = currentTypingUsers.filter(userId => userId !== user?.id);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {chat.participants.slice(0, 3).map((participant, index) => (
              <div key={participant.id} className="relative">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                )}
                {participant.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {chat.type === 'direct' 
                ? chat.participants.find(p => p.id !== user?.id)?.name
                : `${chat.participants.length} members`
              }
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {otherTypingUsers.length > 0 
                ? `${otherTypingUsers.length} typing...`
                : chat.participants.some(p => p.isOnline) ? 'Online' : 'Offline'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            onClick={() => handleStartCall('audio')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Phone className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => handleStartCall('video')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Video className="h-5 w-5" />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {filteredMessages.map((msg, index) => {
            const isOwn = msg.senderId === user?.id;
            const showAvatar = index === 0 || filteredMessages[index - 1].senderId !== msg.senderId;
            const replyToMessage = msg.replyTo ? chat.messages.find(m => m.id === msg.replyTo) : null;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  {!isOwn && showAvatar && (
                    <div className="flex-shrink-0">
                      {msg.senderAvatar ? (
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {msg.senderName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`${isOwn ? 'mr-2' : 'ml-2'}`}>
                    {replyToMessage && (
                      <div className="mb-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-primary-500">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Replying to {replyToMessage.senderName}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                          {replyToMessage.content}
                        </p>
                      </div>
                    )}

                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {!isOwn && showAvatar && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {msg.senderName}
                        </p>
                      )}
                      
                      <p className="text-sm">{msg.content}</p>
                      
                      {msg.edited && (
                        <p className="text-xs opacity-70 mt-1">(edited)</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                      </p>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setReplyTo(msg)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <Reply className="h-3 w-3" />
                        </button>
                        
                        {isOwn && (
                          <>
                            <button
                              onClick={() => setEditingMessage(msg.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-500">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                        
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <Pin className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Reactions */}
                    {msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleReaction(msg.id, reaction.emoji)}
                            className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {otherTypingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {otherTypingUsers.length === 1 ? 'Someone is' : `${otherTypingUsers.length} people are`} typing...
            </span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Reply className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Replying to {replyTo.senderName}
              </span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 truncate mt-1">
            {replyTo.content}
          </p>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <Paperclip className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={darkMode ? 'dark' : 'light'}
                />
              </div>
            )}
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;