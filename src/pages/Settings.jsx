import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiMonitor, FiVolume2, FiGlobe, FiShield, FiHelpCircle, FiUser, FiDatabase } = FiIcons;

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { state, dispatch } = usePlayer();
  const [settings, setSettings] = useState({
    autoplay: true,
    quality: 'auto',
    volume: 80,
    language: 'en',
    subtitles: true,
    notifications: true,
    parentalControl: false,
    recordingQuality: '720p',
    bufferSize: 'medium',
    theme: isDark ? 'dark' : 'light'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Apply theme change immediately
    if (key === 'theme') {
      if ((value === 'dark' && !isDark) || (value === 'light' && isDark)) {
        toggleTheme();
      }
    }
    
    toast.success('Settings updated');
  };

  const handleClearData = (type) => {
    if (window.confirm(`Are you sure you want to clear all ${type}?`)) {
      switch (type) {
        case 'history':
          // Clear history logic
          toast.success('History cleared');
          break;
        case 'favorites':
          state.favorites.forEach(item => {
            dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: item.id });
          });
          toast.success('Favorites cleared');
          break;
        case 'playlists':
          state.playlists.forEach(playlist => {
            dispatch({ type: 'REMOVE_PLAYLIST', payload: playlist.id });
          });
          toast.success('Playlists cleared');
          break;
        default:
          break;
      }
    }
  };

  const settingSections = [
    {
      title: 'Playback',
      icon: FiMonitor,
      settings: [
        {
          key: 'autoplay',
          label: 'Autoplay',
          description: 'Automatically start playback when selecting content',
          type: 'toggle',
          value: settings.autoplay
        },
        {
          key: 'quality',
          label: 'Default Quality',
          description: 'Preferred video quality for playback',
          type: 'select',
          options: [
            { value: 'auto', label: 'Auto' },
            { value: '4k', label: '4K' },
            { value: '1080p', label: '1080p' },
            { value: '720p', label: '720p' },
            { value: '480p', label: '480p' }
          ],
          value: settings.quality
        },
        {
          key: 'bufferSize',
          label: 'Buffer Size',
          description: 'Amount of content to buffer ahead',
          type: 'select',
          options: [
            { value: 'small', label: 'Small (5s)' },
            { value: 'medium', label: 'Medium (10s)' },
            { value: 'large', label: 'Large (15s)' }
          ],
          value: settings.bufferSize
        }
      ]
    },
    {
      title: 'Audio & Video',
      icon: FiVolume2,
      settings: [
        {
          key: 'volume',
          label: 'Default Volume',
          description: 'Starting volume level',
          type: 'slider',
          min: 0,
          max: 100,
          value: settings.volume
        },
        {
          key: 'subtitles',
          label: 'Enable Subtitles',
          description: 'Show subtitles when available',
          type: 'toggle',
          value: settings.subtitles
        },
        {
          key: 'recordingQuality',
          label: 'Recording Quality',
          description: 'Quality for recorded content',
          type: 'select',
          options: [
            { value: '1080p', label: '1080p' },
            { value: '720p', label: '720p' },
            { value: '480p', label: '480p' }
          ],
          value: settings.recordingQuality
        }
      ]
    },
    {
      title: 'Interface',
      icon: FiUser,
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto' }
          ],
          value: settings.theme
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Interface language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' }
          ],
          value: settings.language
        },
        {
          key: 'notifications',
          label: 'Notifications',
          description: 'Show system notifications',
          type: 'toggle',
          value: settings.notifications
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: FiShield,
      settings: [
        {
          key: 'parentalControl',
          label: 'Parental Control',
          description: 'Enable content filtering',
          type: 'toggle',
          value: settings.parentalControl
        }
      ]
    }
  ];

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={setting.value}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        );
      
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {setting.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'slider':
        return (
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              value={setting.value}
              onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
              {setting.value}%
            </span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your IPTV experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={section.icon} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {setting.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {renderSetting(setting)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiDatabase} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Management
              </h2>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Clear History
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remove all viewing history
                </p>
              </div>
              <button
                onClick={() => handleClearData('history')}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Clear Favorites
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remove all favorite items
                </p>
              </div>
              <button
                onClick={() => handleClearData('favorites')}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Clear Playlists
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remove all imported playlists
                </p>
              </div>
              <button
                onClick={() => handleClearData('playlists')}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiHelpCircle} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                About
              </h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Version</span>
                <span className="text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Build</span>
                <span className="text-gray-900 dark:text-white">2024.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Platform</span>
                <span className="text-gray-900 dark:text-white">Web</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                IPTV Pro - Premium streaming experience with advanced features
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;