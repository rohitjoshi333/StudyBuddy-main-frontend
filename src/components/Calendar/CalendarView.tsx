import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  Video,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { CalendarEvent } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { format, isSameDay, startOfDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  workspaceId?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ workspaceId }) => {
  const { events, createEvent } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'study' as CalendarEvent['type'],
    location: '',
    participants: [] as string[]
  });

  const filteredEvents = workspaceId 
    ? events.filter(event => event.workspaceId === workspaceId)
    : events;

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(event.startTime, date)
    );
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'study': return BookOpen;
      case 'meeting': return Users;
      case 'deadline': return AlertCircle;
      case 'reminder': return Clock;
      default: return Clock;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'study': return 'bg-blue-500';
      case 'meeting': return 'bg-green-500';
      case 'deadline': return 'bg-red-500';
      case 'reminder': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.startTime || !newEvent.endTime) return;

    const startDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${newEvent.startTime}`);
    const endDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${newEvent.endTime}`);

    createEvent({
      title: newEvent.title,
      description: newEvent.description,
      startTime: startDateTime,
      endTime: endDateTime,
      type: newEvent.type,
      participants: newEvent.participants,
      workspaceId,
      location: newEvent.location,
      isRecurring: false,
      reminders: [
        {
          id: `reminder-${Date.now()}`,
          time: 30,
          type: 'notification',
          sent: false
        }
      ]
    });

    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      type: 'study',
      location: '',
      participants: []
    });
    setShowCreateEvent(false);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 mt-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={event.id}
                className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}
              />
            ))}
            {dayEvents.length > 2 && (
              <div className="w-2 h-2 rounded-full bg-gray-400" />
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Calendar
          </h2>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === viewType
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateEvent(true)}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Calendar */}
        <div className="flex-1 p-6">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="w-full border-none"
          />
        </div>

        {/* Events Sidebar */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          <div className="space-y-3">
            {getEventsForDate(selectedDate).map((event) => {
              const Icon = getEventTypeIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                      </p>
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.participants.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{event.participants.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {getEventsForDate(selectedDate).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No events scheduled for this day
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Event
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Event title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Event description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="study">Study Session</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Event location..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateEvent(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;