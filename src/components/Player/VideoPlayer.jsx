import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { usePlayer } from '../../contexts/PlayerContext';
import * as FiIcons from 'react-icons/fi';

const { FiMaximize2, FiMinimize2, FiSettings, FiVolume2, FiVolumeX, FiSkipBack, FiSkipForward, FiPlay, FiPause } = FiIcons;

const VideoPlayer = ({ src, poster, onReady }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);
  const { state, dispatch } = usePlayer();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setError(null);
    setIsBuffering(true);

    // Check if HLS is supported
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        liveDurationInfinity: true,
        enableSoftwareAES: true,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 1,
        manifestLoadingRetryDelay: 1000,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 3,
        fragLoadingRetryDelay: 1000,
        startLevel: -1,
        debug: false
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        onReady && onReady(hls);
        dispatch({ type: 'SET_PLAYING', payload: false });
      });

      hls.on(Hls.Events.FRAG_LOADING, () => {
        setIsBuffering(true);
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        setIsBuffering(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error - Please check your connection');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error - Trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              setError('Fatal error - Unable to play this stream');
              hls.destroy();
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false);
        onReady && onReady(video);
      });
    } else {
      // Fallback for direct video URLs
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false);
        onReady && onReady(video);
      });
    }

    // Video event listeners
    const handlePlay = () => dispatch({ type: 'SET_PLAYING', payload: true });
    const handlePause = () => dispatch({ type: 'SET_PLAYING', payload: false });
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleVolumeChange = () => {
      dispatch({ type: 'SET_VOLUME', payload: video.volume });
      dispatch({ type: 'SET_MUTED', payload: video.muted });
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, onReady, dispatch]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(err => {
        console.error('Play failed:', err);
        setError('Unable to play video');
      });
    } else {
      video.pause();
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      dispatch({ type: 'SET_FULLSCREEN', payload: false });
    } else {
      video.requestFullscreen().catch(err => {
        console.error('Fullscreen failed:', err);
      });
      dispatch({ type: 'SET_FULLSCREEN', payload: true });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const seek = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    video.currentTime = newTime;
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Playback Error</h3>
          <p className="text-sm opacity-75">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        preload="metadata"
        crossOrigin="anonymous"
        playsInline
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Custom Controls Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"
      >
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
          <div className="text-white">
            <h3 className="text-lg font-semibold">{state.currentChannel?.name}</h3>
            <p className="text-sm opacity-75">{state.currentChannel?.category}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <SafeIcon icon={state.isMuted ? FiVolumeX : FiVolume2} className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <SafeIcon icon={state.isFullscreen ? FiMinimize2 : FiMaximize2} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <SafeIcon 
              icon={state.isPlaying ? FiPause : FiPlay} 
              className="w-8 h-8 text-white ml-1" 
            />
          </motion.button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2 pointer-events-auto">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => seek(-10)}
                className="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <SafeIcon icon={FiSkipBack} className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <SafeIcon icon={state.isPlaying ? FiPause : FiPlay} className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => seek(10)}
                className="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <SafeIcon icon={FiSkipForward} className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              
              <button className="p-2 rounded-lg bg-black/30 text-white hover:bg-black/50 transition-colors">
                <SafeIcon icon={FiSettings} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;