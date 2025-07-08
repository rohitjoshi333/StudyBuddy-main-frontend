import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  User, 
  Flag, 
  MessageCircle,
  Paperclip,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Task } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface TaskBoardProps {
  workspaceId: string;
  tasks: Task[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ workspaceId, tasks }) => {
  const { updateTask, createTask } = useApp();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignedTo: [] as string[],
    dueDate: ''
  });

  const columns = {
    todo: { title: 'To Do', color: 'bg-gray-100 dark:bg-gray-700' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    completed: { title: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Task['status'];
    
    updateTask(draggableId, { status: newStatus });
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    createTask({
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      status: 'todo',
      priority: newTask.priority,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdBy: '1', // Current user
      tags: [],
      attachments: [],
      comments: [],
      dependencies: []
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: [],
      dueDate: ''
    });
    setShowCreateTask(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Board</h2>
        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Task
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateTask(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Task Board */}
      <div className="flex-1 p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {Object.entries(columns).map(([status, column]) => (
              <div key={status} className="flex flex-col">
                <div className={`p-4 rounded-lg ${column.color} mb-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {column.title}
                    </h3>
                    <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm">
                      {getTasksByStatus(status).length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                    >
                      {getTasksByStatus(status).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                  {task.title}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                  <Flag className="h-3 w-3 inline mr-1" />
                                  {task.priority}
                                </span>
                              </div>

                              {task.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-3">
                                  {task.dueDate && (
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {task.assignedTo.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{task.assignedTo.length}</span>
                                    </div>
                                  )}
                                  
                                  {task.comments.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <MessageCircle className="h-3 w-3" />
                                      <span>{task.comments.length}</span>
                                    </div>
                                  )}
                                  
                                  {task.attachments.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <Paperclip className="h-3 w-3" />
                                      <span>{task.attachments.length}</span>
                                    </div>
                                  )}
                                </div>

                                {task.estimatedHours && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{task.estimatedHours}h</span>
                                  </div>
                                )}
                              </div>

                              {task.status === 'completed' && (
                                <div className="flex items-center justify-center mt-3 text-green-500">
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  <span className="text-xs">Completed</span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskBoard;