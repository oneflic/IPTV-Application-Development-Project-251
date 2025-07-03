import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContentGrid from '../components/ContentGrid/ContentGrid';
import SafeIcon from '../common/SafeIcon';
import { usePlayer } from '../contexts/PlayerContext';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiFilter, FiSearch, FiTrash2 } = FiIcons;

const Favorites = () => {
  const { state, dispatch } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const types = ['All', 'Live TV', 'Movies', 'TV Shows'];

  const filteredFavorites = state.favorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedType === 'All') return matchesSearch;
    
    const typeMap = {
      'Live TV': 'live',
      'Movies': 'movie', 
      'TV Shows': 'series'
    };
    
    return matchesSearch && item.type === typeMap[selectedType];
  });

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      // Clear each favorite individually to trigger the reducer
      state.favorites.forEach(item => {
        dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: item.id });
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your saved content for quick access
          </p>
        </div>
        
        {state.favorites.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFavorites}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      {state.favorites.length > 0 ? (
        <>
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {types.map(type => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-red-500">
                {state.favorites.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Favorites
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-500">
                {state.favorites.filter(item => item.type === 'live').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Live Channels
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-500">
                {state.favorites.filter(item => item.type === 'movie').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Movies
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-500">
                {state.favorites.filter(item => item.type === 'series').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                TV Shows
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <ContentGrid 
            items={filteredFavorites} 
            title={`${selectedType} Favorites`}
          />

          {/* No Results */}
          {filteredFavorites.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <SafeIcon icon={FiSearch} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <SafeIcon icon={FiHeart} className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            No Favorites Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start adding content to your favorites by clicking the heart icon on any channel, movie, or TV show
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Live TV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Explore Movies
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;