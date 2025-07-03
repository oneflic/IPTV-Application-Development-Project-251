import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import { usePlayer } from '../../contexts/PlayerContext';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiHeart, FiMoreVertical, FiTv, FiFilm, FiMonitor } = FiIcons;

const ContentCard = ({ item, type = 'channel' }) => {
  const navigate = useNavigate();
  const { state, dispatch } = usePlayer();

  const handlePlay = (e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_CURRENT_CHANNEL', payload: item });
    dispatch({ type: 'ADD_TO_HISTORY', payload: item });
    navigate(`/player/${item.id}`);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    const isFavorite = state.favorites.some(fav => fav.id === item.id);
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: item.id });
    } else {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: item });
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'movie': return FiFilm;
      case 'series': return FiMonitor;
      default: return FiTv;
    }
  };

  const isFavorite = state.favorites.some(fav => fav.id === item.id);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={item.poster || item.logo || '/api/placeholder/320/180'}
          alt={item.name || item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 group-hover:opacity-100 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-opacity duration-300"
            onClick={handlePlay}
          >
            <SafeIcon icon={FiPlay} className="w-6 h-6 text-white ml-1" />
          </motion.button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5">
            <SafeIcon icon={getTypeIcon()} className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite 
                ? 'bg-red-500/80 text-white' 
                : 'bg-black/60 text-white hover:bg-red-500/80'
            }`}
          >
            <SafeIcon icon={FiHeart} className="w-3 h-3" />
          </motion.button>
        </div>

        {/* Live Indicator */}
        {item.isLive && (
          <div className="absolute bottom-2 left-2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {item.name || item.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
              {item.category || item.genre}
            </p>
            
            {/* Additional Info */}
            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
              {item.quality && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                  {item.quality}
                </span>
              )}
              {item.language && (
                <span>{item.language}</span>
              )}
              {item.duration && (
                <span>{item.duration}</span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;