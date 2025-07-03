import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MiniPlayer from '../Player/MiniPlayer';
import { usePlayer } from '../../contexts/PlayerContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state } = usePlayer();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
        
        {state.currentChannel && !state.isFullscreen && (
          <MiniPlayer />
        )}
      </div>
    </div>
  );
};

export default Layout;