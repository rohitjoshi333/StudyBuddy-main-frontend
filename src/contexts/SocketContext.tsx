import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message, User } from '../types';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  typingUsers: { [chatId: string]: string[] };
  sendMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  startVideoCall: (workspaceId: string, participants: string[]) => void;
  joinVideoCall: (callId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [chatId: string]: string[] }>({});

  useEffect(() => {
    if (user) {
      // In a real app, this would connect to your backend
      const newSocket = io('ws://localhost:3001', {
        auth: {
          userId: user.id,
          token: localStorage.getItem('auth_token')
        }
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        toast.success('Connected to real-time services');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        toast.error('Disconnected from real-time services');
      });

      newSocket.on('users_online', (users: string[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('user_typing', ({ chatId, userId, userName }: { chatId: string; userId: string; userName: string }) => {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []).filter(id => id !== userId), userId]
        }));
      });

      newSocket.on('user_stop_typing', ({ chatId, userId }: { chatId: string; userId: string }) => {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || []).filter(id => id !== userId)
        }));
      });

      newSocket.on('new_message', (message: Message) => {
        // Handle incoming messages
        toast.success(`New message from ${message.senderName}`);
      });

      newSocket.on('video_call_invitation', ({ callId, from }: { callId: string; from: User }) => {
        toast.success(`Video call invitation from ${from.name}`, {
          duration: 10000,
          action: {
            label: 'Join',
            onClick: () => joinVideoCall(callId)
          }
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const sendMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socket) {
      socket.emit('send_message', { chatId, message });
    }
  };

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave_room', roomId);
    }
  };

  const startTyping = (chatId: string) => {
    if (socket) {
      socket.emit('typing', { chatId });
    }
  };

  const stopTyping = (chatId: string) => {
    if (socket) {
      socket.emit('stop_typing', { chatId });
    }
  };

  const startVideoCall = (workspaceId: string, participants: string[]) => {
    if (socket) {
      socket.emit('start_video_call', { workspaceId, participants });
    }
  };

  const joinVideoCall = (callId: string) => {
    if (socket) {
      socket.emit('join_video_call', { callId });
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
    startVideoCall,
    joinVideoCall
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};