import React, { useState } from 'react'; // Import useState from React
import YouTube from 'react-youtube';

function VideoPlayer({ videoId }) {
  const [player, setPlayer] = useState(null); // Use useState inside the functional component

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
  };

  return (
    <div>
      {/* Render the YouTube video player */}
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
    </div>
  );
}

export default VideoPlayer;
