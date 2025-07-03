import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import { usePlayer } from '../../contexts/PlayerContext';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiMaximize2, FiX, FiVolume2, FiVolumeX } = FiIcons;

const MiniPlayer = () => {
  const navigate = useNavigate();
  const { state, dispatch } = usePlayer();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    navigate(`/player/${state.currentChannel.id}`);
  };

  const handleClose = () => {
    dispatch({ type: 'SET_CURRENT_CHANNEL', payload: null });
  };

  const togglePlay = () => {
    dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
  };

  const toggleMute = () => {
    dispatch({ type: 'SET_MUTED', payload: !state.isMuted });
  };

  return (
    <AnimatePresence>
      {state.currentChannel && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-80">
            {/* Video Preview */}
            <div className="relative h-44 bg-black">
              <img
                src={state.currentChannel.poster || '/api/placeholder/320/180'}
                alt={state.currentChannel.name}
                className="w-full h-full object-cover"
              />
              
              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <SafeIcon 
                    icon={state.isPlaying ? FiPause : FiPlay} 
                    className="w-6 h-6 text-white" 
                  />
                </motion.button>
              </div>

              {/* Top Controls */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={handleExpand}
                  className="p-1.5 bg-black/30 rounded text-white hover:bg-black/50 transition-colors"
                >
                  <SafeIcon icon={FiMaximize2} className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 bg-black/30 rounded text-white hover:bg-black/50 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {state.currentChannel.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {state.currentChannel.category}
              </p>
              
              {/* Controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                  >
                    <SafeIcon 
                      icon={state.isPlaying ? FiPause : FiPlay} 
                      className="w-4 h-4" 
                    />
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <SafeIcon 
                      icon={state.isMuted ? FiVolumeX : FiVolume2} 
                      className="w-4 h-4" 
                    />
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">2:34</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniPlayer;