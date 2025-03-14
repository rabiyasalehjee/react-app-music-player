import React from "react";
import "./MusicPlayer.css"; // Import CSS file

const MusicPlayer = () => {
  return (
    <div className="music-player">
      {/* Blurred Container */}
      <div className="player-container">
        {/* Moving Bubbles */}
        <div className="bubble blue-bubble"></div>
        <div className="bubble pink-bubble"></div>
        <h1>My Music Player</h1>
      </div>
    </div>
  );
};

export default MusicPlayer;
