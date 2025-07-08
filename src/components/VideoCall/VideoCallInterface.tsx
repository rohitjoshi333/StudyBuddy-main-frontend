import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MonitorOff,
  Users,
  Settings,
  MessageCircle,
  MoreVertical,
  Volume2,
  VolumeX
} from 'lucide-react';
import { VideoCall, User } from '../../types';
import Webcam from 'react-webcam';

interface VideoCallInterfaceProps {
  call: VideoCall;
  participants: User[];
  onEndCall: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  call,
  participants,
  onEndCall,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const getGridLayout = () => {
    const count = participants.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900 z-50 flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -100 }}
        className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Video Call</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Recording</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>{participants.length}</span>
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Participants Grid */}
        <div className={`h-full grid ${getGridLayout()} gap-2 p-4`}>
          {participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-gray-800 rounded-lg overflow-hidden"
            >
              {/* Video Stream */}
              {participant.id === '1' && isVideoEnabled ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="w-full h-full object-cover"
                  mirrored
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Participant Info */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">
                      {participant.name}
                      {participant.id === '1' && ' (You)'}
                    </span>
                    <div className="flex items-center space-x-1">
                      {!isAudioEnabled && participant.id === '1' && (
                        <MicOff className="h-4 w-4 text-red-400" />
                      )}
                      {!isVideoEnabled && participant.id === '1' && (
                        <VideoOff className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Speaking Indicator */}
              <div className="absolute inset-0 border-4 border-green-400 rounded-lg opacity-0 animate-pulse"></div>
            </motion.div>
          ))}
        </div>

        {/* Screen Share Overlay */}
        {isScreenSharing && (
          <div className="absolute inset-4 bg-gray-900 rounded-lg border-2 border-blue-500 flex items-center justify-center">
            <div className="text-center text-white">
              <Monitor className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Screen Sharing</h3>
              <p className="text-gray-400">Your screen is being shared with participants</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 100 }}
        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6 z-10"
      >
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-4 rounded-full transition-colors ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={onToggleScreenShare}
            className={`p-4 rounded-full transition-colors ${
              isScreenSharing
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
          </button>

          {/* Volume Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            <PhoneOff className="h-6 w-6" />
          </button>

          {/* More Options */}
          <button className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors">
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>
      </motion.div>

      {/* Participants Panel */}
      {showParticipants && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-xl z-20"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Participants ({participants.length})
              </h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-3">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {participant.name}
                    {participant.id === '1' && ' (You)'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {participant.course}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-xl z-20"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chat
              </h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Chat during video calls coming soon...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoCallInterface;