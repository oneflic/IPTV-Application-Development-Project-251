import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentGrid from '../components/ContentGrid/ContentGrid';
import SafeIcon from '../common/SafeIcon';
import { usePlayer } from '../contexts/PlayerContext';
import { generateSamplePlaylist } from '../utils/playlistParser';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiGrid, FiList, FiSearch, FiTv } = FiIcons;

const LiveTV = () => {
  const { state } = usePlayer();
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    // Get live channels from all playlists
    const allChannels = state.playlists.flatMap(playlist => 
      (playlist.channels || []).filter(channel => channel.type === 'live' || channel.isLive)
    );

    // If no channels, use sample data
    if (allChannels.length === 0) {
      const sampleData = generateSamplePlaylist().filter(item => item.type === 'live');
      setChannels(sampleData);
      setFilteredChannels(sampleData);
    } else {
      setChannels(allChannels);
      setFilteredChannels(allChannels);
    }

    // Extract unique categories
    const uniqueCategories = ['All', ...new Set(allChannels.map(channel => channel.category))];
    setCategories(uniqueCategories);
  }, [state.playlists]);

  useEffect(() => {
    let filtered = channels;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(channel => channel.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredChannels(filtered);
  }, [channels, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live TV</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Watch live channels from around the world
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <SafeIcon icon={FiGrid} className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <SafeIcon icon={FiList} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.slice(0, 8).map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {filteredChannels.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Live Channels
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {categories.length - 1}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Categories
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-500">
            {filteredChannels.filter(ch => ch.isLive).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Currently Live
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <ContentGrid 
        items={filteredChannels} 
        type="live"
        title={`${selectedCategory} Channels`}
      />

      {/* Empty State */}
      {filteredChannels.length === 0 && channels.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiTv} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Live Channels
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add some playlists to start watching live TV channels
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Add Playlist
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default LiveTV;