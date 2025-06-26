const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const MAX_RESULTS = 10;

function parseISODuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

async function getTopVideoByEstimatedWatchTime(query) {
  try {  
    const searchResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          q: query,
          part: 'snippet',
          maxResults: MAX_RESULTS,
          type: 'video',
          order: 'relevance'
        }
      }
    );
    
    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
    
    if (!videoIds) {
      return null;
    }
    
    const statsResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          id: videoIds,
          part: 'statistics,contentDetails,snippet'
        }
      }
    );
    
    let topVideo = null;
    let maxEstimatedWatchTime = 0;
    
    for (const video of statsResponse.data.items) {
      const views = parseInt(video.statistics.viewCount || 0);
      const durationSeconds = parseISODuration(video.contentDetails.duration);
      const estimatedWatchTime = views * durationSeconds;
      
      if (estimatedWatchTime > maxEstimatedWatchTime) {
        maxEstimatedWatchTime = estimatedWatchTime;
        topVideo = {
          title: video.snippet.title,
          id: video.id,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          thumbnail: video.snippet.thumbnails.default.url,
          views,
          channel : video.snippet.channelTitle,
          duration: `${durationSeconds}s`,
          estimatedWatchTime: `${estimatedWatchTime} seconds`
        };
      }
    }
    
    return topVideo;
  }

  catch (error) {
    console.error('Error fetching top video:', error);
    return null;
  }
}

module.exports =  { getTopVideoByEstimatedWatchTime };