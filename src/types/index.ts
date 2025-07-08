export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  course: string;
  year: string;
  university: string;
  interests: string[];
  skills: string[];
  studyStyle: 'solo' | 'pair' | 'group';
  availability: {
    days: string[];
    timeSlots: string[];
  };
  preferences: {
    studyEnvironment: string[];
    goals: string[];
  };
  isOnline: boolean;
  lastSeen: Date;
  rating: number;
  totalCollaborations: number;
  xp: number;
  level: number;
  badges: Badge[];
  streak: number;
  timezone: string;
  language: string;
  isVerified: boolean;
  institution?: Institution;
}

export interface Institution {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  verified: boolean;
  location: string;
  type: 'university' | 'college' | 'school';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Match {
  id: string;
  user: User;
  matchPercentage: number;
  commonInterests: string[];
  status: 'pending' | 'matched' | 'rejected';
  createdAt: Date;
  compatibility: {
    interests: number;
    schedule: number;
    studyStyle: number;
    goals: number;
  };
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: User[];
  isPrivate: boolean;
  category: string;
  tags: string[];
  files: WorkspaceFile[];
  tasks: Task[];
  createdAt: Date;
  lastActivity: Date;
  memberCount: number;
  settings: WorkspaceSettings;
  aiEnabled: boolean;
  calendar: CalendarEvent[];
  notes: Note[];
  whiteboards: Whiteboard[];
}

export interface WorkspaceSettings {
  allowFileUpload: boolean;
  allowInvites: boolean;
  maxMembers: number;
  requireApproval: boolean;
  aiAssistantEnabled: boolean;
  videoCallsEnabled: boolean;
  taskManagementEnabled: boolean;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  isShared: boolean;
  downloadCount: number;
  thumbnail?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  createdBy: string;
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
}

export interface TaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  edited: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'file' | 'system' | 'ai' | 'emoji' | 'code' | 'poll';
  timestamp: Date;
  isRead: boolean;
  reactions: MessageReaction[];
  replyTo?: string;
  edited: boolean;
  editedAt?: Date;
  metadata?: any;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Chat {
  id: string;
  type: 'direct' | 'workspace' | 'group';
  participants: User[];
  workspaceId?: string;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  isTyping: string[];
  pinnedMessages: string[];
  settings: ChatSettings;
}

export interface ChatSettings {
  notifications: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
}

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'workspace' | 'task' | 'system' | 'reminder' | 'achievement';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  metadata?: any;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'study' | 'meeting' | 'deadline' | 'reminder';
  participants: string[];
  workspaceId?: string;
  location?: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  reminders: EventReminder[];
}

export interface EventReminder {
  id: string;
  time: number; // minutes before event
  type: 'notification' | 'email';
  sent: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  tags: string[];
  isShared: boolean;
  collaborators: string[];
  version: number;
  format: 'markdown' | 'rich-text';
}

export interface Whiteboard {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  elements: WhiteboardElement[];
  collaborators: string[];
  isLocked: boolean;
}

export interface WhiteboardElement {
  id: string;
  type: 'text' | 'shape' | 'line' | 'image' | 'sticky-note';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style: any;
  createdBy: string;
  createdAt: Date;
}

export interface VideoCall {
  id: string;
  workspaceId?: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  status: 'waiting' | 'active' | 'ended';
  type: 'audio' | 'video' | 'screen-share';
  recording?: string;
  settings: CallSettings;
}

export interface CallSettings {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  recordingEnabled: boolean;
  maxParticipants: number;
}

export interface AIAssistant {
  id: string;
  workspaceId: string;
  conversations: AIConversation[];
  settings: AISettings;
  knowledgeBase: string[];
  lastActive: Date;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  context: string;
  createdAt: Date;
  lastUpdated: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface AISettings {
  enabled: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  personality: 'helpful' | 'academic' | 'casual' | 'professional';
}

export interface Analytics {
  userId: string;
  studyTime: number;
  tasksCompleted: number;
  messagesExchanged: number;
  collaborations: number;
  streakDays: number;
  xpEarned: number;
  badgesEarned: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  workspaceId?: string;
  rating: number;
  comment: string;
  categories: {
    communication: number;
    reliability: number;
    knowledge: number;
    helpfulness: number;
  };
  isPublic: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  interests?: string[];
  course?: string;
  year?: string;
  university?: string;
  studyStyle?: string;
  availability?: string[];
  rating?: number;
  location?: string;
  language?: string;
  verified?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  sound: boolean;
  matches: boolean;
  messages: boolean;
  workspaces: boolean;
  tasks: boolean;
  reminders: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'university' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showEmail: boolean;
  dataSharing: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}