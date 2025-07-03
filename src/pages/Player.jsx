import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoPlayer from '../components/Player/VideoPlayer';
import SafeIcon from '../common/SafeIcon';
import { usePlayer } from '../contexts/PlayerContext';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiList, FiSettings, FiMaximize2, FiMinimize2 } = FiIcons;

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = usePlayer();
  const [showChannelList, setShowChannelList] = useState(false);
  const [relatedChannels, setRelatedChannels] = useState([]);

  useEffect(() => {
    // Find the channel by ID
    const allChannels = state.playlists.flatMap(playlist => playlist.channels || []);
    const channel = allChannels.find(ch => ch.id === id);
    
    if (channel) {
      dispatch({ type: 'SET_CURRENT_CHANNEL', payload: channel });
      dispatch({ type: 'ADD_TO_HISTORY', payload: channel });
      
      // Get related channels from the same category
      const related = allChannels
        .filter(ch => ch.category === channel.category && ch.id !== channel.id)
        .slice(0, 10);
      setRelatedChannels(related);
    }
  }, [id, state.playlists, dispatch]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChannelSelect = (channel) => {
    navigate(`/player/${channel.id}`);
    setShowChannelList(false);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      dispatch({ type: 'SET_FULLSCREEN', payload: false });
    } else {
      document.documentElement.requestFullscreen();
      dispatch({ type: 'SET_FULLSCREEN', payload: true });
    }
  };

  if (!state.currentChannel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading player...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Video Player */}
      <div className="relative w-full h-screen">
        <VideoPlayer
          src={state.currentChannel.url}
          poster={state.currentChannel.poster}
          onReady={(player) => {
            console.log('Player ready:', player);
          }}
        />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
            </motion.button>
            
            <div className="text-white">
              <h1 className="text-xl font-semibold">{state.currentChannel.name}</h1>
              <p className="text-sm opacity-75">{state.currentChannel.category}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChannelList(!showChannelList)}
              className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
            >
              <SafeIcon icon={FiList} className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
            >
              <SafeIcon icon={state.isFullscreen ? FiMinimize2 : FiMaximize2} className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Channel List Overlay */}
        {showChannelList && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-0 right-0 w-80 h-full bg-black/80 backdrop-blur-sm z-30 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-semibold">Related Channels</h2>
                <button
                  onClick={() => setShowChannelList(false)}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2">
                {relatedChannels.map((channel) => (
                  <motion.button
                    key={channel.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChannelSelect(channel)}
                    className="w-full p-3 bg-white/10 rounded-lg text-left hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={channel.logo || channel.poster || '/api/placeholder/48/48'}
                        alt={channel.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm truncate">
                          {channel.name}
                        </h3>
                        <p className="text-white/70 text-xs truncate">
                          {channel.category}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Player;