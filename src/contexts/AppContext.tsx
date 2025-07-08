import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Match, 
  Workspace, 
  Chat, 
  Notification, 
  User, 
  Task, 
  CalendarEvent, 
  Analytics,
  AppSettings,
  AIAssistant,
  VideoCall
} from '../types';
import toast from 'react-hot-toast';

interface AppContextType {
  matches: Match[];
  workspaces: Workspace[];
  chats: Chat[];
  notifications: Notification[];
  tasks: Task[];
  events: CalendarEvent[];
  analytics: Analytics[];
  settings: AppSettings;
  aiAssistants: AIAssistant[];
  videoCalls: VideoCall[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  unreadNotifications: number;
  markNotificationRead: (id: string) => void;
  addMatch: (match: Match) => void;
  updateMatchStatus: (id: string, status: 'matched' | 'rejected') => void;
  createWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'lastActivity'>) => void;
  joinWorkspace: (workspaceId: string) => void;
  leaveWorkspace: (workspaceId: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  earnXP: (amount: number, reason: string) => void;
  updateStreak: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Enhanced mock data with all features
const mockUsers: User[] = [
  {
    id: '2',
    name: 'Alex Chen',
    email: 'alex@mit.edu',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Full-stack developer passionate about React and Node.js. Love building scalable web applications.',
    course: 'JavaScript, React, Node.js',
    year: '3rd Year',
    university: 'MIT',
    interests: ['Web Development', 'Full Stack Development', 'JavaScript', 'React'],
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    studyStyle: 'pair',
    availability: { days: ['Tuesday', 'Thursday'], timeSlots: ['Evening'] },
    preferences: { studyEnvironment: ['Library'], goals: ['Exam Preparation'] },
    isOnline: true,
    lastSeen: new Date(),
    rating: 4.9,
    totalCollaborations: 12,
    xp: 2450,
    level: 5,
    badges: [
      {
        id: 'helper',
        name: 'Helper',
        description: 'Helped 10 students',
        icon: '🤝',
        color: '#10B981',
        earnedAt: new Date(),
        rarity: 'common'
      }
    ],
    streak: 7,
    timezone: 'UTC-8',
    language: 'en',
    isVerified: true
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@stanford.edu',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Data science enthusiast working on machine learning projects. Always excited to collaborate!',
    course: 'Python, Machine Learning, Data Science',
    year: '4th Year',
    university: 'Stanford University',
    interests: ['Data Science', 'Machine Learning', 'Python', 'Analytics'],
    skills: ['Python', 'TensorFlow', 'Pandas', 'SQL'],
    studyStyle: 'group',
    availability: { days: ['Monday', 'Wednesday', 'Friday'], timeSlots: ['Morning'] },
    preferences: { studyEnvironment: ['Lab', 'Library'], goals: ['Research Collaboration'] },
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    rating: 4.7,
    totalCollaborations: 18,
    xp: 3200,
    level: 7,
    badges: [
      {
        id: 'researcher',
        name: 'Researcher',
        description: 'Completed 5 research projects',
        icon: '🔬',
        color: '#8B5CF6',
        earnedAt: new Date(),
        rarity: 'rare'
      }
    ],
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
    bio: 'Mobile app developer specializing in React Native and Flutter. Building the next big thing!',
    course: 'React Native, Flutter, Mobile Development',
    year: '2nd Year',
    university: 'Harvard University',
    interests: ['Mobile Development', 'React Native', 'Flutter', 'UI/UX Design'],
    skills: ['React Native', 'Flutter', 'Dart', 'Swift'],
    studyStyle: 'group',
    availability: { days: ['Tuesday', 'Thursday', 'Saturday'], timeSlots: ['Afternoon'] },
    preferences: { studyEnvironment: ['Online', 'Cafe'], goals: ['Project Collaboration'] },
    isOnline: true,
    lastSeen: new Date(),
    rating: 4.8,
    totalCollaborations: 8,
    xp: 1800,
    level: 4,
    badges: [
      {
        id: 'innovator',
        name: 'Innovator',
        description: 'Created 3 innovative projects',
        icon: '💡',
        color: '#F59E0B',
        earnedAt: new Date(),
        rarity: 'common'
      }
    ],
    streak: 5,
    timezone: 'UTC-8',
    language: 'en',
    isVerified: true
  },
  {
    id: '5',
    name: 'Sophia Kim',
    email: 'sophia@berkeley.edu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Backend engineer focused on scalable systems. Love working with microservices and cloud tech.',
    course: 'Java, Spring Boot, AWS',
    year: '3rd Year',
    university: 'UC Berkeley',
    interests: ['Backend Development', 'Cloud Computing', 'System Design', 'DevOps'],
    skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
    studyStyle: 'pair',
    availability: { days: ['Monday', 'Wednesday', 'Friday'], timeSlots: ['Evening'] },
    preferences: { studyEnvironment: ['Library', 'Online'], goals: ['Skill Development'] },
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    rating: 4.9,
    totalCollaborations: 15,
    xp: 2800,
    level: 6,
    badges: [
      {
        id: 'architect',
        name: 'System Architect',
        description: 'Designed 5 system architectures',
        icon: '🏗️',
        color: '#6366F1',
        earnedAt: new Date(),
        rarity: 'rare'
      }
    ],
    streak: 10,
    timezone: 'UTC-8',
    language: 'en',
    isVerified: true
  },
  {
    id: '6',
    name: 'David Park',
    email: 'david@cmu.edu',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'AI/ML researcher working on computer vision projects. Always looking for research partners.',
    course: 'Python, TensorFlow, Computer Vision',
    year: 'Graduate',
    university: 'Carnegie Mellon University',
    interests: ['Artificial Intelligence', 'Computer Vision', 'Deep Learning', 'Research'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV'],
    studyStyle: 'group',
    availability: { days: ['Tuesday', 'Thursday', 'Saturday'], timeSlots: ['Morning', 'Afternoon'] },
    preferences: { studyEnvironment: ['Lab', 'Online'], goals: ['Research Collaboration'] },
    isOnline: true,
    lastSeen: new Date(),
    rating: 4.95,
    totalCollaborations: 22,
    xp: 4200,
    level: 8,
    badges: [
      {
        id: 'researcher',
        name: 'AI Researcher',
        description: 'Published 3 research papers',
        icon: '🤖',
        color: '#8B5CF6',
        earnedAt: new Date(),
        rarity: 'epic'
      }
    ],
    streak: 15,
    timezone: 'UTC-5',
    language: 'en',
    isVerified: true
  },
  {
    id: '7',
    name: 'Isabella Martinez',
    email: 'isabella@gatech.edu',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Frontend developer passionate about creating beautiful user experiences with React and Vue.',
    course: 'React, Vue.js, UI/UX Design',
    year: '2nd Year',
    university: 'Georgia Tech',
    interests: ['Frontend Development', 'UI/UX Design', 'Web Development', 'Design Systems'],
    skills: ['React', 'Vue.js', 'CSS', 'Figma'],
    studyStyle: 'pair',
    availability: { days: ['Monday', 'Tuesday', 'Thursday'], timeSlots: ['Afternoon'] },
    preferences: { studyEnvironment: ['Cafe', 'Online'], goals: ['Project Collaboration'] },
    isOnline: false,
    lastSeen: new Date(Date.now() - 45 * 60 * 1000),
    rating: 4.6,
    totalCollaborations: 9,
    xp: 1950,
    level: 4,
    badges: [
      {
        id: 'designer',
        name: 'UI Designer',
        description: 'Created 10 beautiful designs',
        icon: '🎨',
        color: '#EC4899',
        earnedAt: new Date(),
        rarity: 'rare'
      }
    ],
    streak: 8,
    timezone: 'UTC-5',
    language: 'en',
    isVerified: true
  },
  {
    id: '8',
    name: 'Ryan Thompson',
    email: 'ryan@uw.edu',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Cybersecurity enthusiast learning ethical hacking and penetration testing. Security first!',
    course: 'Cybersecurity, Ethical Hacking, Network Security',
    year: '3rd Year',
    university: 'University of Washington',
    interests: ['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Penetration Testing'],
    skills: ['Python', 'Kali Linux', 'Wireshark', 'Metasploit'],
    studyStyle: 'group',
    availability: { days: ['Wednesday', 'Friday', 'Sunday'], timeSlots: ['Evening'] },
    preferences: { studyEnvironment: ['Lab', 'Online'], goals: ['Certification Prep'] },
    isOnline: true,
    lastSeen: new Date(),
    rating: 4.8,
    totalCollaborations: 11,
    xp: 2300,
    level: 5,
    badges: [
      {
        id: 'security',
        name: 'Security Expert',
        description: 'Found 5 security vulnerabilities',
        icon: '🛡️',
        color: '#DC2626',
        earnedAt: new Date(),
        rarity: 'rare'
      }
    ],
    streak: 6,
    timezone: 'UTC-8',
    language: 'en',
    isVerified: true
  },
  {
    id: '9',
    name: 'Aisha Patel',
    email: 'aisha@caltech.edu',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Game developer creating indie games with Unity and C#. Love bringing creative ideas to life!',
    course: 'C#, Unity, Game Development',
    year: '4th Year',
    university: 'Caltech',
    interests: ['Game Development', 'Unity', 'C#', 'Indie Games'],
    skills: ['C#', 'Unity', 'Blender', 'Game Design'],
    studyStyle: 'pair',
    availability: { days: ['Monday', 'Thursday', 'Saturday'], timeSlots: ['Afternoon', 'Evening'] },
    preferences: { studyEnvironment: ['Studio', 'Online'], goals: ['Project Collaboration'] },
    isOnline: false,
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000),
    rating: 4.7,
    totalCollaborations: 13,
    xp: 2600,
    level: 5,
    badges: [
      {
        id: 'gamedev',
        name: 'Game Creator',
        description: 'Published 2 indie games',
        icon: '🎮',
        color: '#7C3AED',
        earnedAt: new Date(),
        rarity: 'epic'
      }
    ],
    streak: 9,
    timezone: 'UTC-8',
    language: 'en',
    isVerified: true
  },
  {
    id: '10',
    name: 'James Wilson',
    email: 'james@princeton.edu',
    avatar: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'DevOps engineer passionate about automation and CI/CD. Making deployment seamless for everyone.',
    course: 'DevOps, Docker, Kubernetes',
    year: 'Graduate',
    university: 'Princeton University',
    interests: ['DevOps', 'Cloud Computing', 'Automation', 'CI/CD'],
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    studyStyle: 'group',
    availability: { days: ['Tuesday', 'Wednesday', 'Friday'], timeSlots: ['Morning'] },
    preferences: { studyEnvironment: ['Online', 'Lab'], goals: ['Skill Development'] },
    isOnline: true,
    lastSeen: new Date(),
    rating: 4.9,
    totalCollaborations: 16,
    xp: 3100,
    level: 6,
    badges: [
      {
        id: 'devops',
        name: 'DevOps Master',
        description: 'Automated 10 deployment pipelines',
        icon: '⚙️',
        color: '#059669',
        earnedAt: new Date(),
        rarity: 'rare'
      }
    ],
    streak: 11,
    timezone: 'UTC-5',
    language: 'en',
    isVerified: true
  },
  {
    id: '11',
    name: 'Maya Singh',
    email: 'maya@yale.edu',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Blockchain developer exploring DeFi and smart contracts. Building the future of finance!',
    course: 'Solidity, Blockchain, Smart Contracts',
    year: '3rd Year',
    university: 'Yale University',
    interests: ['Blockchain', 'Smart Contracts', 'DeFi', 'Cryptocurrency'],
    skills: ['Solidity', 'Web3.js', 'Ethereum', 'Truffle'],
    studyStyle: 'pair',
    availability: { days: ['Monday', 'Wednesday', 'Saturday'], timeSlots: ['Evening'] },
    preferences: { studyEnvironment: ['Online', 'Library'], goals: ['Research Collaboration'] },
    isOnline: false,
    lastSeen: new Date(Date.now() - 20 * 60 * 1000),
    rating: 4.8,
    totalCollaborations: 7,
    xp: 1700,
    level: 3,
    badges: [
      {
        id: 'blockchain',
        name: 'Blockchain Pioneer',
        description: 'Deployed 5 smart contracts',
        icon: '⛓️',
        color: '#F59E0B',
        earnedAt: new Date(),
        rarity: 'epic'
      }
    ],
    streak: 4,
    timezone: 'UTC-5',
    language: 'en',
    isVerified: true
  },
  {
    id: '12',
    name: 'Carlos Rodriguez',
    email: 'carlos@columbia.edu',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Full-stack developer with expertise in MERN stack. Love building end-to-end applications.',
    course: 'MongoDB, Express.js, React, Node.js',
    year: '4th Year',
    university: 'Columbia University',
    interests: ['Full Stack Development', 'MERN Stack', 'API Development', 'Database Design'],
    skills: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    studyStyle: 'group',
    availability: { days: ['Tuesday', 'Thursday', 'Sunday'], timeSlots: ['Afternoon'] },
    preferences: { studyEnvironment: ['Cafe', 'Online'], goals: ['Project Collaboration'] },
    isOnline: true,
    lastSeen: new Date(),
    rating: 4.7,
    totalCollaborations: 14,
    xp: 2750,
    level: 5,
    badges: [
      {
        id: 'fullstack',
        name: 'Full Stack Hero',
        description: 'Built 8 complete applications',
        icon: '🚀',
        color: '#3B82F6',
        earnedAt: new Date(),
        rarity: 'rare'
      }
    ],
    streak: 13,
    timezone: 'UTC-8',
    language: 'en',
    isVerified: true
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [aiAssistants, setAiAssistants] = useState<AIAssistant[]>([]);
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'auto',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      desktop: true,
      sound: true,
      matches: true,
      messages: true,
      workspaces: true,
      tasks: true,
      reminders: true
    },
    privacy: {
      profileVisibility: 'university',
      showOnlineStatus: true,
      allowDirectMessages: true,
      showEmail: false,
      dataSharing: false
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false
    }
  });

  useEffect(() => {
    // Initialize comprehensive mock data
    const mockMatches: Match[] = mockUsers.map((user, index) => ({
      id: `match-${user.id}`,
      user,
      matchPercentage: 85 - index * 10,
      commonInterests: ['Mathematics', 'Problem Solving'],
      status: 'pending',
      createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      compatibility: {
        interests: 0.9,
        schedule: 0.8,
        studyStyle: 0.7,
        goals: 0.85
      }
    }));

    const mockWorkspaces: Workspace[] = [
      {
        id: 'ws-1',
        name: 'AI Study Group',
        description: 'Collaborative learning space for AI and ML topics',
        createdBy: '1',
        members: [mockUsers[0], mockUsers[1]],
        isPrivate: false,
        category: 'Computer Science',
        tags: ['AI', 'Machine Learning', 'Python'],
        files: [
          {
            id: 'file-1',
            name: 'ML_Notes.pdf',
            url: '/files/ml-notes.pdf',
            type: 'application/pdf',
            size: 2048576,
            uploadedBy: '1',
            uploadedAt: new Date(),
            tags: ['notes', 'machine-learning'],
            isShared: true,
            downloadCount: 15
          }
        ],
        tasks: [],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(),
        memberCount: 2,
        settings: {
          allowFileUpload: true,
          allowInvites: true,
          maxMembers: 10,
          requireApproval: false,
          aiAssistantEnabled: true,
          videoCallsEnabled: true,
          taskManagementEnabled: true
        },
        aiEnabled: true,
        calendar: [],
        notes: [],
        whiteboards: []
      }
    ];

    const mockTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Complete ML Assignment',
        description: 'Implement a neural network for image classification',
        assignedTo: ['1'],
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        createdBy: '1',
        tags: ['assignment', 'machine-learning'],
        attachments: [],
        comments: [],
        estimatedHours: 8,
        dependencies: []
      }
    ];

    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'AI Study Session',
        description: 'Weekly AI study group meeting',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        type: 'study',
        participants: ['1', '2'],
        workspaceId: 'ws-1',
        isRecurring: true,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
        reminders: [
          {
            id: 'reminder-1',
            time: 30,
            type: 'notification',
            sent: false
          }
        ]
      }
    ];

    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'match',
        title: 'New Match Found!',
        message: 'You have a new study partner match with Alex Chen',
        isRead: false,
        createdAt: new Date(),
        priority: 'medium',
        category: 'matching'
      },
      {
        id: 'notif-2',
        type: 'workspace',
        title: 'Workspace Invitation',
        message: 'Emma Rodriguez invited you to join "Biology Research Group"',
        isRead: false,
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        priority: 'high',
        category: 'workspace'
      },
      {
        id: 'notif-3',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You earned the "Collaborative Learner" badge',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'low',
        category: 'gamification'
      }
    ];

    const mockAnalytics: Analytics[] = [
      {
        userId: '1',
        studyTime: 120,
        tasksCompleted: 3,
        messagesExchanged: 45,
        collaborations: 2,
        streakDays: 7,
        xpEarned: 150,
        badgesEarned: 1,
        period: 'daily',
        date: new Date()
      }
    ];

    setMatches(mockMatches);
    setWorkspaces(mockWorkspaces);
    setTasks(mockTasks);
    setEvents(mockEvents);
    setNotifications(mockNotifications);
    setAnalytics(mockAnalytics);

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('studybuddy_darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    // Check for saved settings
    const savedSettings = localStorage.getItem('studybuddy_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('studybuddy_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('studybuddy_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const addMatch = (match: Match) => {
    setMatches(prev => [match, ...prev]);
  };

  const updateMatchStatus = (id: string, status: 'matched' | 'rejected') => {
    setMatches(prev => 
      prev.map(match => 
        match.id === id ? { ...match, status } : match
      )
    );

    if (status === 'matched') {
      toast.success('New study partner connected!');
      earnXP(50, 'New connection');
    }
  };

  const createWorkspace = (workspaceData: Omit<Workspace, 'id' | 'createdAt' | 'lastActivity'>) => {
    const newWorkspace: Workspace = {
      ...workspaceData,
      id: `ws-${Date.now()}`,
      createdAt: new Date(),
      lastActivity: new Date()
    };
    setWorkspaces(prev => [newWorkspace, ...prev]);
    toast.success('Workspace created successfully!');
    earnXP(100, 'Created workspace');
  };

  const joinWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => 
      prev.map(ws => 
        ws.id === workspaceId 
          ? { ...ws, memberCount: ws.memberCount + 1 }
          : ws
      )
    );
    toast.success('Joined workspace successfully!');
    earnXP(25, 'Joined workspace');
  };

  const leaveWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => 
      prev.map(ws => 
        ws.id === workspaceId 
          ? { ...ws, memberCount: ws.memberCount - 1 }
          : ws
      )
    );
    toast.success('Left workspace');
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => 
      prev.map(ws => 
        ws.id === id ? { ...ws, ...updates, lastActivity: new Date() } : ws
      )
    );
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date()
    };
    setTasks(prev => [newTask, ...prev]);
    toast.success('Task created successfully!');
    earnXP(20, 'Created task');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );

    if (updates.status === 'completed') {
      toast.success('Task completed!');
      earnXP(50, 'Completed task');
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted');
  };

  const createEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`
    };
    setEvents(prev => [newEvent, ...prev]);
    toast.success('Event created successfully!');
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast.success('Event deleted');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Settings updated');
  };

  const earnXP = (amount: number, reason: string) => {
    // Update user XP and check for level up
    toast.success(`+${amount} XP: ${reason}`);
    
    // Add to analytics
    setAnalytics(prev => {
      const today = prev.find(a => 
        a.date.toDateString() === new Date().toDateString() && a.period === 'daily'
      );
      
      if (today) {
        return prev.map(a => 
          a === today ? { ...a, xpEarned: a.xpEarned + amount } : a
        );
      } else {
        return [...prev, {
          userId: '1',
          studyTime: 0,
          tasksCompleted: 0,
          messagesExchanged: 0,
          collaborations: 0,
          streakDays: 0,
          xpEarned: amount,
          badgesEarned: 0,
          period: 'daily',
          date: new Date()
        }];
      }
    });
  };

  const updateStreak = () => {
    // Update daily streak
    const today = new Date().toDateString();
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (lastActivity !== today) {
      localStorage.setItem('lastActivity', today);
      earnXP(10, 'Daily streak');
    }
  };

  const value = {
    matches,
    workspaces,
    chats,
    notifications,
    tasks,
    events,
    analytics,
    settings,
    aiAssistants,
    videoCalls,
    darkMode,
    toggleDarkMode,
    unreadNotifications,
    markNotificationRead,
    addMatch,
    updateMatchStatus,
    createWorkspace,
    joinWorkspace,
    leaveWorkspace,
    updateWorkspace,
    createTask,
    updateTask,
    deleteTask,
    createEvent,
    updateEvent,
    deleteEvent,
    updateSettings,
    earnXP,
    updateStreak
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};