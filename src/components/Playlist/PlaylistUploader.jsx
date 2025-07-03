import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SafeIcon from '../../common/SafeIcon';
import { usePlayer } from '../../contexts/PlayerContext';
import { parseM3U } from '../../utils/playlistParser';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiLink, FiPlus, FiFile, FiX, FiGlobe, FiFolder } = FiIcons;

const PlaylistUploader = ({ onClose }) => {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { dispatch } = usePlayer();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const channels = parseM3U(text);
      
      if (channels.length === 0) {
        toast.error('No valid channels found in the playlist');
        setLoading(false);
        return;
      }

      const playlist = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        channels,
        createdAt: new Date().toISOString(),
        type: 'file',
        source: 'upload'
      };

      dispatch({ type: 'ADD_PLAYLIST', payload: playlist });
      toast.success(`Playlist "${playlist.name}" added successfully with ${channels.length} channels!`);
      onClose();
    } catch (error) {
      toast.error('Failed to parse playlist file');
      console.error('Playlist parsing error:', error);
    }
    setLoading(false);
  }, [dispatch, onClose]);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(urlInput, {
        method: 'GET',
        headers: {
          'User-Agent': 'IPTV-Pro/1.0',
          'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, text/plain, */*'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      const channels = parseM3U(text);

      if (channels.length === 0) {
        toast.error('No valid channels found in the playlist URL');
        setLoading(false);
        return;
      }

      const urlObj = new URL(urlInput);
      const playlist = {
        id: Date.now().toString(),
        name: urlObj.pathname.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'URL Playlist',
        channels,
        url: urlInput,
        createdAt: new Date().toISOString(),
        type: 'url',
        source: 'url'
      };

      dispatch({ type: 'ADD_PLAYLIST', payload: playlist });
      toast.success(`Playlist "${playlist.name}" added successfully with ${channels.length} channels!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to load playlist: ${error.message}`);
      console.error('URL loading error:', error);
    }
    setLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-mpegURL': ['.m3u', '.m3u8'],
      'text/plain': ['.m3u', '.m3u8'],
      'audio/x-mpegurl': ['.m3u', '.m3u8'],
      'application/vnd.apple.mpegurl': ['.m3u8']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => {
      setDragActive(false);
      toast.error('Please upload only M3U or M3U8 files');
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add IPTV Playlist
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Upload Playlist File
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive || dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  isDragActive || dragActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}>
                  <SafeIcon icon={FiUpload} className="w-8 h-8" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragActive || dragActive ? 'Drop your playlist here!' : 'Drag & drop your playlist'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    or <span className="text-blue-500 font-medium">browse files</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiFile} className="w-4 h-4" />
                    <span>M3U</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiFile} className="w-4 h-4" />
                    <span>M3U8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                or
              </span>
            </div>
          </div>

          {/* URL Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Add from URL
            </label>
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="relative">
                <SafeIcon icon={FiLink} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/playlist.m3u8"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={loading}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding Playlist...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    <span>Add Playlist</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <SafeIcon icon={FiGlobe} className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">Supported formats:</p>
                <ul className="space-y-1 text-xs">
                  <li>• M3U and M3U8 files</li>
                  <li>• HTTP/HTTPS URLs</li>
                  <li>• Live streaming channels</li>
                  <li>• VOD content (Movies & TV Shows)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlaylistUploader;