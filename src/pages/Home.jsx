import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentGrid from '../components/ContentGrid/ContentGrid';
import PlaylistUploader from '../components/Playlist/PlaylistUploader';
import SafeIcon from '../common/SafeIcon';
import { usePlayer } from '../contexts/PlayerContext';
import { generateSamplePlaylist } from '../utils/playlistParser';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiClock, FiHeart, FiTv, FiFilm, FiMonitor, FiPlus, FiUpload } = FiIcons;

const Home = () => {
  const { state } = usePlayer();
  const [featuredContent, setFeaturedContent] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [stats, setStats] = useState({
    totalChannels: 0,
    totalMovies: 0,
    totalSeries: 0,
    favorites: 0
  });

  useEffect(() => {
    // Get all content from playlists
    const allContent = state.playlists.flatMap(playlist => playlist.channels || []);
    
    // If no playlists, use sample data
    if (allContent.length === 0) {
      const sampleData = generateSamplePlaylist();
      setFeaturedContent(sampleData.slice(0, 5));
    } else {
      setFeaturedContent(allContent.slice(0, 10));
    }
    
    setRecentlyWatched(state.history.slice(0, 8));
    
    // Calculate stats
    setStats({
      totalChannels: allContent.filter(item => item.type === 'live').length,
      totalMovies: allContent.filter(item => item.type === 'movie').length,
      totalSeries: allContent.filter(item => item.type === 'series').length,
      favorites: state.favorites.length
    });
  }, [state.playlists, state.history, state.favorites]);

  const statCards = [
    { 
      title: 'Live Channels', 
      value: stats.totalChannels, 
      icon: FiTv, 
      color: 'bg-blue-500', 
      change: '+5.2%' 
    },
    { 
      title: 'Movies', 
      value: stats.totalMovies, 
      icon: FiFilm, 
      color: 'bg-green-500', 
      change: '+12.1%' 
    },
    { 
      title: 'TV Shows', 
      value: stats.totalSeries, 
      icon: FiMonitor, 
      color: 'bg-purple-500', 
      change: '+8.7%' 
    },
    { 
      title: 'Favorites', 
      value: stats.favorites, 
      icon: FiHeart, 
      color: 'bg-red-500', 
      change: '+3.4%' 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to IPTV Pro</h1>
          <p className="text-blue-100 text-lg">
            Your ultimate streaming experience with premium features
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploader(true)}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
              <span>Add Playlist</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Explore Content
            </motion.button>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </motion.div>

      {/* Quick Upload Section */}
      {state.playlists.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <div className="text-center">
            <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Get Started with Your First Playlist
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Upload an M3U/M3U8 file or add a playlist URL to start watching
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploader(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
              <span>Add Your First Playlist</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recently Watched */}
      {recentlyWatched.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <SafeIcon icon={FiClock} className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Continue Watching
            </h2>
          </div>
          <ContentGrid items={recentlyWatched} />
        </motion.div>
      )}

      {/* Featured Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Content
          </h2>
        </div>
        <ContentGrid items={featuredContent} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <SafeIcon icon={FiTv} className="w-6 h-6 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Browse Live TV</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Watch live channels</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <SafeIcon icon={FiFilm} className="w-6 h-6 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Explore Movies</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Discover new films</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            <SafeIcon icon={FiHeart} className="w-6 h-6 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">My Favorites</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your saved content</p>
          </button>
        </div>
      </motion.div>

      {/* Playlist Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <PlaylistUploader onClose={() => setShowUploader(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;