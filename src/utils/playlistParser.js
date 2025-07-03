export const parseM3U = (content) => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      // Parse channel info
      const info = line.substring(8);
      const parts = info.split(',');
      
      if (parts.length >= 2) {
        const attributes = parts[0];
        const name = parts.slice(1).join(',').trim();
        
        currentChannel = {
          id: Date.now() + Math.random(),
          name: name,
          duration: -1
        };

        // Parse attributes
        const attrMatches = attributes.match(/(\w+(?:-\w+)*)="([^"]*)"/g);
        if (attrMatches) {
          attrMatches.forEach(match => {
            const [, key, value] = match.match(/(\w+(?:-\w+)*)="([^"]*)"/);
            switch (key.toLowerCase()) {
              case 'tvg-logo':
                currentChannel.logo = value;
                currentChannel.poster = value;
                break;
              case 'group-title':
                currentChannel.category = value;
                break;
              case 'tvg-name':
                currentChannel.tvgName = value;
                break;
              case 'tvg-id':
                currentChannel.tvgId = value;
                break;
              case 'radio':
                currentChannel.isRadio = value === 'true';
                break;
              case 'tvg-country':
                currentChannel.country = value;
                break;
              case 'tvg-language':
                currentChannel.language = value;
                break;
            }
          });
        }

        // Determine content type and category
        currentChannel.type = determineContentType(currentChannel.name, currentChannel.category);
        if (!currentChannel.category) {
          currentChannel.category = categorizeContent(currentChannel.name);
        }
      }
    } else if (line && !line.startsWith('#') && currentChannel.name) {
      // This is the URL for the current channel
      currentChannel.url = line;
      currentChannel.isLive = isLiveStream(line);
      currentChannel.quality = extractQuality(currentChannel.name, line);
      
      // Add additional metadata
      if (!currentChannel.poster && !currentChannel.logo) {
        currentChannel.poster = '/api/placeholder/320/180';
      }
      
      channels.push({ ...currentChannel });
      currentChannel = {};
    }
  }

  return channels;
};

const determineContentType = (name, category) => {
  const nameLower = name.toLowerCase();
  const categoryLower = (category || '').toLowerCase();

  // Movies
  if (categoryLower.includes('movie') || 
      categoryLower.includes('film') || 
      categoryLower.includes('cinema') ||
      categoryLower.includes('vod') ||
      nameLower.includes('movie') ||
      nameLower.match(/\b(19|20)\d{2}\b/) || // Year pattern
      nameLower.includes('bluray') ||
      nameLower.includes('dvdrip')) {
    return 'movie';
  }

  // TV Shows/Series
  if (categoryLower.includes('series') || 
      categoryLower.includes('show') || 
      categoryLower.includes('drama') ||
      categoryLower.includes('episode') ||
      nameLower.includes('season') || 
      nameLower.includes('episode') || 
      nameLower.includes('s0') || 
      nameLower.match(/s\d+e\d+/) ||
      nameLower.match(/\bs\d+\b/) ||
      nameLower.includes('ep.')) {
    return 'series';
  }

  // Live TV (default)
  return 'live';
};

const categorizeContent = (name) => {
  const nameLower = name.toLowerCase();

  // News
  if (nameLower.includes('news') || 
      nameLower.includes('cnn') || 
      nameLower.includes('bbc') || 
      nameLower.includes('fox') ||
      nameLower.includes('msnbc') ||
      nameLower.includes('sky news') ||
      nameLower.includes('al jazeera')) {
    return 'News';
  }

  // Sports
  if (nameLower.includes('sport') || 
      nameLower.includes('espn') || 
      nameLower.includes('football') || 
      nameLower.includes('soccer') || 
      nameLower.includes('basketball') || 
      nameLower.includes('tennis') ||
      nameLower.includes('golf') ||
      nameLower.includes('baseball') ||
      nameLower.includes('hockey') ||
      nameLower.includes('olympics')) {
    return 'Sports';
  }

  // Kids
  if (nameLower.includes('kids') || 
      nameLower.includes('cartoon') || 
      nameLower.includes('disney') || 
      nameLower.includes('nick') ||
      nameLower.includes('children') ||
      nameLower.includes('baby') ||
      nameLower.includes('junior')) {
    return 'Kids';
  }

  // Movies
  if (nameLower.includes('movie') || 
      nameLower.includes('cinema') || 
      nameLower.includes('film') ||
      nameLower.includes('hollywood') ||
      nameLower.includes('bollywood')) {
    return 'Movies';
  }

  // Music
  if (nameLower.includes('music') || 
      nameLower.includes('mtv') || 
      nameLower.includes('radio') ||
      nameLower.includes('hits') ||
      nameLower.includes('top 40') ||
      nameLower.includes('rock') ||
      nameLower.includes('pop') ||
      nameLower.includes('jazz')) {
    return 'Music';
  }

  // Documentary
  if (nameLower.includes('discovery') || 
      nameLower.includes('national geographic') || 
      nameLower.includes('history') || 
      nameLower.includes('documentary') ||
      nameLower.includes('nature') ||
      nameLower.includes('science') ||
      nameLower.includes('animal planet')) {
    return 'Documentary';
  }

  // Adult content (filtered)
  if (nameLower.includes('xxx') || 
      nameLower.includes('adult') || 
      nameLower.includes('18+')) {
    return 'Adult';
  }

  // Entertainment (default)
  return 'Entertainment';
};

const isLiveStream = (url) => {
  return url.includes('.m3u8') || 
         url.includes('.ts') ||
         url.includes('live') || 
         url.includes('stream') || 
         url.includes('rtmp') ||
         url.includes('rtsp') ||
         url.includes('udp://') ||
         url.includes('rtp://');
};

const extractQuality = (name, url) => {
  const combined = `${name} ${url}`.toLowerCase();
  
  if (combined.includes('4k') || combined.includes('2160p') || combined.includes('uhd')) return '4K';
  if (combined.includes('1080p') || combined.includes('fhd') || combined.includes('fullhd')) return '1080p';
  if (combined.includes('720p') || combined.includes('hd')) return '720p';
  if (combined.includes('480p') || combined.includes('sd')) return '480p';
  if (combined.includes('360p')) return '360p';
  if (combined.includes('240p')) return '240p';
  
  return 'Auto';
};

export const generateSamplePlaylist = () => {
  return [
    {
      id: 'sample-1',
      name: 'BBC One HD',
      url: 'https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8',
      category: 'News',
      type: 'live',
      isLive: true,
      quality: '1080p',
      logo: '/api/placeholder/100/100',
      poster: '/api/placeholder/320/180',
      country: 'UK',
      language: 'English'
    },
    {
      id: 'sample-2',
      name: 'Discovery Channel',
      url: 'https://food-dlvr-ott.akamaized.net/primary/3/def27b3dd6854290bc7f42daa93c65ea/index.m3u8',
      category: 'Documentary',
      type: 'live',
      isLive: true,
      quality: '720p',
      logo: '/api/placeholder/100/100',
      poster: '/api/placeholder/320/180',
      country: 'US',
      language: 'English'
    },
    {
      id: 'sample-3',
      name: 'ESPN Sports',
      url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
      category: 'Sports',
      type: 'live',
      isLive: true,
      quality: '1080p',
      logo: '/api/placeholder/100/100',
      poster: '/api/placeholder/320/180',
      country: 'US',
      language: 'English'
    },
    {
      id: 'sample-4',
      name: 'The Matrix (1999)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      category: 'Action',
      type: 'movie',
      isLive: false,
      quality: '4K',
      duration: '2h 16m',
      poster: '/api/placeholder/320/180',
      language: 'English'
    },
    {
      id: 'sample-5',
      name: 'Breaking Bad S01E01',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      category: 'Drama',
      type: 'series',
      isLive: false,
      quality: '1080p',
      duration: '47m',
      poster: '/api/placeholder/320/180',
      language: 'English'
    },
    {
      id: 'sample-6',
      name: 'CNN International',
      url: 'https://cnn-cnninternational-1-de.samsung.wurl.com/manifest/playlist.m3u8',
      category: 'News',
      type: 'live',
      isLive: true,
      quality: '720p',
      logo: '/api/placeholder/100/100',
      poster: '/api/placeholder/320/180',
      country: 'US',
      language: 'English'
    }
  ];
};