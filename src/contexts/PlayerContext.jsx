import React, { createContext, useContext, useReducer } from 'react';

const PlayerContext = createContext();

const initialState = {
  currentChannel: null,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  quality: 'auto',
  subtitles: null,
  audioTrack: null,
  isFullscreen: false,
  isPiP: false,
  history: [],
  favorites: JSON.parse(localStorage.getItem('iptv-favorites') || '[]'),
  playlists: JSON.parse(localStorage.getItem('iptv-playlists') || '[]'),
  currentPlaylist: null,
};

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_CHANNEL':
      return { ...state, currentChannel: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    case 'SET_QUALITY':
      return { ...state, quality: action.payload };
    case 'SET_SUBTITLES':
      return { ...state, subtitles: action.payload };
    case 'SET_AUDIO_TRACK':
      return { ...state, audioTrack: action.payload };
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    case 'SET_PIP':
      return { ...state, isPiP: action.payload };
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.history.filter(item => item.id !== action.payload.id)].slice(0, 50);
      return { ...state, history: newHistory };
    case 'ADD_TO_FAVORITES':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('iptv-favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    case 'REMOVE_FROM_FAVORITES':
      const filteredFavorites = state.favorites.filter(item => item.id !== action.payload);
      localStorage.setItem('iptv-favorites', JSON.stringify(filteredFavorites));
      return { ...state, favorites: filteredFavorites };
    case 'ADD_PLAYLIST':
      const newPlaylists = [...state.playlists, action.payload];
      localStorage.setItem('iptv-playlists', JSON.stringify(newPlaylists));
      return { ...state, playlists: newPlaylists };
    case 'REMOVE_PLAYLIST':
      const filteredPlaylists = state.playlists.filter(playlist => playlist.id !== action.payload);
      localStorage.setItem('iptv-playlists', JSON.stringify(filteredPlaylists));
      return { ...state, playlists: filteredPlaylists };
    case 'SET_CURRENT_PLAYLIST':
      return { ...state, currentPlaylist: action.payload };
    default:
      return state;
  }
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};