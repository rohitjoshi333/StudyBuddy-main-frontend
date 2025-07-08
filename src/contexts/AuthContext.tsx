import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demonstration
const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@university.edu',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  bio: 'Computer Science student passionate about AI and machine learning. Looking for study partners to work on projects and prepare for exams together.',
  course: 'JavaScript, React, Python, Machine Learning',
  year: '3rd Year',
  university: 'Tech University',
  interests: ['AI', 'Machine Learning', 'Web Development', 'Data Science', 'Algorithms'],
  skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL'],
  studyStyle: 'group',
  availability: {
    days: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['Morning', 'Afternoon']
  },
  preferences: {
    studyEnvironment: ['Library', 'Online', 'Study Rooms'],
    goals: ['Exam Preparation', 'Project Collaboration', 'Skill Development']
  },
  isOnline: true,
  lastSeen: new Date(),
  rating: 4.8,
  totalCollaborations: 15,
  xp: 3500,
  level: 7,
  badges: [
    {
      id: 'collaborator',
      name: 'Team Player',
      description: 'Completed 15 collaborations',
      icon: '🤝',
      color: '#10B981',
      earnedAt: new Date(),
      rarity: 'common'
    },
    {
      id: 'learner',
      name: 'Quick Learner',
      description: 'Mastered 5 new skills',
      icon: '🧠',
      color: '#3B82F6',
      earnedAt: new Date(),
      rarity: 'rare'
    }
  ],
  streak: 14,
  timezone: 'UTC-8',
  language: 'en',
  isVerified: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('studybuddy_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login - accept any email/password
    const loggedInUser = { ...mockUser, email };
    setUser(loggedInUser);
    localStorage.setItem('studybuddy_user', JSON.stringify(loggedInUser));
    setLoading(false);
  };

  const register = async (userData: Partial<User>) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...mockUser,
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
    } as User;
    
    setUser(newUser);
    localStorage.setItem('studybuddy_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studybuddy_user');
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('studybuddy_user', JSON.stringify(updatedUser));
    setLoading(false);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};