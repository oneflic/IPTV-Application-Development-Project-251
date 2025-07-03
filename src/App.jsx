import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import LiveTV from './pages/LiveTV';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Player from './pages/Player';
import PlaylistManager from './pages/PlaylistManager';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/player/:id" element={<Player />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="live-tv" element={<LiveTV />} />
                <Route path="movies" element={<Movies />} />
                <Route path="tv-shows" element={<TVShows />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="playlists" element={<PlaylistManager />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </div>
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;