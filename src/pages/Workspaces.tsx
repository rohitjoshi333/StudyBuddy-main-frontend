import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Users,
  Settings,
  Star,
  Calendar,
  MessageCircle,
  FileText,
  Video,
  Bot
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import WorkspaceCard from '../components/Workspace/WorkspaceCard';
import TaskBoard from '../components/Tasks/TaskBoard';
import CalendarView from '../components/Calendar/CalendarView';
import ChatInterface from '../components/Chat/ChatInterface';
import AIAssistant from '../components/AI/AIAssistant';
import { Workspace } from '../types';

const Workspaces: React.FC = () => {
  const { workspaces, createWorkspace, joinWorkspace } = useApp();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'calendar' | 'chat' | 'files'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    category: '',
    isPrivate: false,
    tags: [] as string[]
  });

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) return;

    createWorkspace({
      name: newWorkspace.name,
      description: newWorkspace.description,
      createdBy: '1', // Current user
      members: [], // Will be populated with current user
      isPrivate: newWorkspace.isPrivate,
      category: newWorkspace.category,
      tags: newWorkspace.tags,
      files: [],
      tasks: [],
      memberCount: 1,
      settings: {
        allowFileUpload: true,
        allowInvites: true,
        maxMembers: 50,
        requireApproval: false,
        aiAssistantEnabled: true,
        videoCallsEnabled: true,
        taskManagementEnabled: true
      },
      aiEnabled: true,
      calendar: [],
      notes: [],
      whiteboards: []
    });

    setNewWorkspace({
      name: '',
      description: '',
      category: '',
      isPrivate: false,
      tags: []
    });
    setShowCreateModal(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Grid },
    { id: 'tasks', label: 'Tasks', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'files', label: 'Files', icon: FileText }
  ];

  if (selectedWorkspace) {
    return (
      <div className="h-screen flex flex-col">
        {/* Workspace Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedWorkspace(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Back
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedWorkspace.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedWorkspace.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedWorkspace.memberCount} members
                </span>
              </div>
              
              {selectedWorkspace.aiEnabled && (
                <button
                  onClick={() => setShowAI(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                >
                  <Bot className="h-4 w-4" />
                  <span>AI Assistant</span>
                </button>
              )}
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors">
                <Video className="h-4 w-4" />
                <span>Start Call</span>
              </button>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Tasks</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedWorkspace.tasks.filter(t => t.status !== 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Files Shared</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedWorkspace.files.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Members</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedWorkspace.memberCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        New file uploaded: ML_Notes.pdf
                      </span>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Task completed: Review assignment
                      </span>
                      <span className="text-xs text-gray-500">4h ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        New member joined the workspace
                      </span>
                      <span className="text-xs text-gray-500">1d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <TaskBoard 
              workspaceId={selectedWorkspace.id} 
              tasks={selectedWorkspace.tasks} 
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView workspaceId={selectedWorkspace.id} />
          )}

          {activeTab === 'chat' && (
            <div className="h-full">
              <div className="text-center py-12 text-gray-500">
                Chat interface will be integrated here
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="p-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Shared Files
                </h3>
                {selectedWorkspace.files.length > 0 ? (
                  <div className="space-y-3">
                    {selectedWorkspace.files.map((file) => (
                      <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.downloadCount} downloads
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-sm hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>No files shared yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant */}
        {showAI && (
          <AIAssistant
            workspaceId={selectedWorkspace.id}
            onClose={() => setShowAI(false)}
            onMinimize={() => setShowAI(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Workspaces
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Collaborate with your study partners in shared workspaces
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Workspace</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Workspaces Grid */}
      {filteredWorkspaces.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredWorkspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WorkspaceCard
                workspace={workspace}
                onJoin={joinWorkspace}
                onOpen={setSelectedWorkspace}
                isOwner={workspace.createdBy === '1'}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No workspaces found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first workspace to get started'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Create Workspace
          </button>
        </div>
      )}

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Workspace
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter workspace name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your workspace..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newWorkspace.category}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select category</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newWorkspace.isPrivate}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Make this workspace private
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Workspace
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;