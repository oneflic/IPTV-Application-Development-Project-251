import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentGrid from '../components/ContentGrid/ContentGrid';
import SafeIcon from '../common/SafeIcon';
import { usePlayer } from '../contexts/PlayerContext';
import { generateSamplePlaylist } from '../utils/playlistParser';
import * as FiIcons from 'react-icons/fi';

const { FiMonitor, FiFilter, FiSearch, FiTrendingUp } = FiIcons;

const TVShows = () => {
  const { state } = usePlayer();
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState(['All']);
  const [statuses] = useState(['All', 'Ongoing', 'Completed', 'New']);

  useEffect(() => {
    // Get TV shows from all playlists
    const allShows = state.playlists.flatMap(playlist => 
      (playlist.channels || []).filter(channel => channel.type === 'series')
    );

    // If no shows, use sample data
    if (allShows.length === 0) {
      const sampleData = generateSamplePlaylist().filter(item => item.type === 'series');
      // Add more sample TV shows
      const additionalShows = [
        {
          id: 'show-1',
          name: 'Stranger Things',
          category: 'Sci-Fi',
          type: 'series',
          quality: '4K',
          seasons: 4,
          episodes: 34,
          status: 'Ongoing',
          rating: 8.7,
          poster: '/api/placeholder/320/180'
        },
        {
          id: 'show-2',
          name: 'The Crown',
          category: 'Drama',
          type: 'series',
          quality: '1080p',
          seasons: 6,
          episodes: 60,
          status: 'Completed',
          rating: 8.6,
          poster: '/api/placeholder/320/180'
        },
        {
          id: 'show-3',
          name: 'Wednesday',
          category: 'Mystery',
          type: 'series',
          quality: '4K',
          seasons: 1,
          episodes: 8,
          status: 'New',
          rating: 8.1,
          poster: '/api/placeholder/320/180'
        },
        {
          id: 'show-4',
          name: 'The Mandalorian',
          category: 'Sci-Fi',
          type: 'series',
          quality: '4K',
          seasons: 3,
          episodes: 24,
          status: 'Ongoing',
          rating: 8.8,
          poster: '/api/placeholder/320/180'
        }
      ];
      const showData = [...sampleData, ...additionalShows];
      setShows(showData);
      setFilteredShows(showData);
    } else {
      setShows(allShows);
      setFilteredShows(allShows);
    }

    // Extract unique genres
    const allContent = allShows.length > 0 ? allShows : shows;
    const uniqueGenres = ['All', ...new Set(allContent.map(show => show.category))];
    setGenres(uniqueGenres);
  }, [state.playlists]);

  useEffect(() => {
    let filtered = shows;

    // Filter by genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(show => show.category === selectedGenre);
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(show => show.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(show =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredShows(filtered);
  }, [shows, selectedGenre, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TV Shows</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Binge-watch your favorite series and discover new ones
          </p>
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
              placeholder="Search TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {genres.slice(0, 8).map(genre => (
            <motion.button
              key={genre}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === genre
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {genre}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {filteredShows.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            TV Shows
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {genres.length - 1}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Genres
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-500">
            {filteredShows.filter(s => s.status === 'New').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            New Shows
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center text-2xl font-bold text-purple-500">
            <SafeIcon icon={FiTrendingUp} className="w-6 h-6 mr-1" />
            {filteredShows.filter(s => s.status === 'Ongoing').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Ongoing
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <ContentGrid 
        items={filteredShows} 
        type="series"
        title={`${selectedGenre} TV Shows`}
      />

      {/* Empty State */}
      {filteredShows.length === 0 && shows.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiMonitor} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No TV Shows Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add some series playlists to start watching
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Add Series Playlist
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TVShows;