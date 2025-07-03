import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentGrid from '../components/ContentGrid/ContentGrid';
import SafeIcon from '../common/SafeIcon';
import { usePlayer } from '../contexts/PlayerContext';
import { generateSamplePlaylist } from '../utils/playlistParser';
import * as FiIcons from 'react-icons/fi';

const { FiFilm, FiFilter, FiSearch, FiStar } = FiIcons;

const Movies = () => {
  const { state } = usePlayer();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState(['All']);
  const [qualities, setQualities] = useState(['All']);

  useEffect(() => {
    // Get movies from all playlists
    const allMovies = state.playlists.flatMap(playlist => 
      (playlist.channels || []).filter(channel => channel.type === 'movie')
    );

    // If no movies, use sample data
    if (allMovies.length === 0) {
      const sampleData = generateSamplePlaylist().filter(item => item.type === 'movie');
      // Add more sample movies
      const additionalMovies = [
        {
          id: 'movie-1',
          name: 'Inception (2010)',
          category: 'Sci-Fi',
          type: 'movie',
          quality: '4K',
          duration: '2h 28m',
          rating: 8.8,
          poster: '/api/placeholder/320/180'
        },
        {
          id: 'movie-2',
          name: 'The Dark Knight (2008)',
          category: 'Action',
          type: 'movie',
          quality: '1080p',
          duration: '2h 32m',
          rating: 9.0,
          poster: '/api/placeholder/320/180'
        },
        {
          id: 'movie-3',
          name: 'Pulp Fiction (1994)',
          category: 'Crime',
          type: 'movie',
          quality: '1080p',
          duration: '2h 34m',
          rating: 8.9,
          poster: '/api/placeholder/320/180'
        }
      ];
      const movieData = [...sampleData, ...additionalMovies];
      setMovies(movieData);
      setFilteredMovies(movieData);
    } else {
      setMovies(allMovies);
      setFilteredMovies(allMovies);
    }

    // Extract unique genres and qualities
    const allContent = allMovies.length > 0 ? allMovies : movies;
    const uniqueGenres = ['All', ...new Set(allContent.map(movie => movie.category))];
    const uniqueQualities = ['All', ...new Set(allContent.map(movie => movie.quality).filter(Boolean))];
    setGenres(uniqueGenres);
    setQualities(uniqueQualities);
  }, [state.playlists]);

  useEffect(() => {
    let filtered = movies;

    // Filter by genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(movie => movie.category === selectedGenre);
    }

    // Filter by quality
    if (selectedQuality !== 'All') {
      filtered = filtered.filter(movie => movie.quality === selectedQuality);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [movies, selectedGenre, selectedQuality, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Movies</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and watch your favorite movies
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
              placeholder="Search movies..."
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

          {/* Quality Filter */}
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {qualities.map(quality => (
              <option key={quality} value={quality}>
                {quality}
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
            {filteredMovies.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Movies
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
          <div className="text-2xl font-bold text-blue-500">
            {filteredMovies.filter(m => m.quality === '4K').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            4K Movies
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center text-2xl font-bold text-yellow-500">
            <SafeIcon icon={FiStar} className="w-6 h-6 mr-1" />
            8.5
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Avg Rating
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <ContentGrid 
        items={filteredMovies} 
        type="movie"
        title={`${selectedGenre} Movies`}
      />

      {/* Empty State */}
      {filteredMovies.length === 0 && movies.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiFilm} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Movies Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add some movie playlists to start watching
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Add Movie Playlist
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Movies;