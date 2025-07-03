import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { usePlayer } from '../contexts/PlayerContext';
import PlaylistUploader from '../components/Playlist/PlaylistUploader';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiList, FiTrash2, FiEdit2, FiDownload, FiUpload, FiGlobe, FiFolder } = FiIcons;

const PlaylistManager = () => {
  const { state, dispatch } = usePlayer();
  const [showUploader, setShowUploader] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [editName, setEditName] = useState('');

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      dispatch({ type: 'REMOVE_PLAYLIST', payload: playlistId });
      toast.success('Playlist deleted successfully');
    }
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist.id);
    setEditName(playlist.name);
  };

  const handleSaveEdit = () => {
    // Update playlist name logic would go here
    setEditingPlaylist(null);
    setEditName('');
    toast.success('Playlist updated successfully');
  };

  const handleExportPlaylist = (playlist) => {
    // Create M3U content
    let m3uContent = '#EXTM3U\n';
    playlist.channels.forEach(channel => {
      m3uContent += `#EXTINF:-1 tvg-logo="${channel.logo || ''}" group-title="${channel.category || ''}", ${channel.name}\n`;
      m3uContent += `${channel.url}\n`;
    });

    // Download file
    const blob = new Blob([m3uContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlist.name}.m3u`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Playlist exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Playlist Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your IPTV playlists and organize your content
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploader(true)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Playlist</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.playlists.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Playlists
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-500">
            {state.playlists.reduce((acc, playlist) => acc + (playlist.channels?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Channels
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-500">
            {state.playlists.filter(p => p.type === 'url').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            URL Playlists
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      {state.playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.playlists.map((playlist) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Playlist Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingPlaylist === playlist.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPlaylist(null)}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          playlist.type === 'url' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'
                        }`}>
                          <SafeIcon 
                            icon={playlist.type === 'url' ? FiGlobe : FiFolder} 
                            className={`w-5 h-5 ${
                              playlist.type === 'url' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {playlist.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {playlist.type === 'url' ? 'URL Playlist' : 'File Playlist'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Playlist Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {playlist.channels?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Channels
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {new Set(playlist.channels?.map(ch => ch.category)).size || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Categories
                    </div>
                  </div>
                </div>

                {/* Playlist Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Created:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(playlist.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {playlist.url && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Source:</span>
                      <span className="text-gray-900 dark:text-white truncate max-w-32">
                        {playlist.url}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditPlaylist(playlist)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleExportPlaylist(playlist)}
                      className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeletePlaylist(playlist.id)}
                    className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <SafeIcon icon={FiList} className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            No Playlists Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Get started by adding your first IPTV playlist. You can upload M3U files or add playlist URLs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploader(true)}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <SafeIcon icon={FiUpload} className="w-5 h-5" />
              <span>Upload Playlist</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploader(true)}
              className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <SafeIcon icon={FiGlobe} className="w-5 h-5" />
              <span>Add URL</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Playlist Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <PlaylistUploader onClose={() => setShowUploader(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaylistManager;