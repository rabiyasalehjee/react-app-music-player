import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "./MusicPlayer.css";

const MusicPlayer = () => {
  const [songs, setSongs] = useState([
    { id: 1, title: "Dreamy Nights", singer: "Luna Vox", image: "card-img-1.jpg", duration: "3:45", isFavorite: false },
    { id: 2, title: "Midnight Groove", singer: "Stellar Beats", image: "card-img-2.jpg", duration: "4:12", isFavorite: false },
    { id: 3, title: "Summer Breeze", singer: "Solar Tunes", image: "card-img-3.jpg", duration: "3:30", isFavorite: false },
    { id: 4, title: "Starlight Serenade", singer: "Echo Pulse", image: "card-img-4.jpg", duration: "4:00", isFavorite: false },
    { id: 5, title: "Neon Dreams", singer: "Synthwave Collective", image: "card-img-5.jpg", duration: "4:10", isFavorite: false },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);
  const songRowRefs = useRef([]);
  const swiperRef = useRef(null);

  const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  };

  const images = importAll(require.context("../assets", false, /\.(png|jpe?g|svg)$/));

  const toggleFavorite = (id) => {
    setSongs(songs.map(song =>
      song.id === id ? { ...song, isFavorite: !song.isFavorite } : song
    ));
  };

  useEffect(() => {
    const activeRow = songRowRefs.current[activeIndex];
    if (activeRow) {
      const timeoutId = setTimeout(() => {
        activeRow.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest"
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      console.warn(`No ref found for index ${activeIndex}`);
    }
  }, [activeIndex]);

  const handleSlideChange = (swiper) => {
    setTimeout(() => {
      setActiveIndex(swiper.activeIndex);
    }, 100);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((currentTime / duration) * 100);
  };

  return (
    <div className="music-player">
      <div className="player-container">
        <div className="bubble blue-bubble"></div>
        <div className="bubble pink-bubble"></div>

        <div className="player-grid">
          <div className="card-stack-column">
            <Swiper
              effect="cards"
              grabCursor={true}
              modules={[EffectCards]}
              cardsEffect={{
                perSlideOffset: 9,
                perSlideRotate: 3,
              }}
              speed={700}
              initialSlide={0}
              className="swiper"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
            >
              {songs.map((song, index) => (
                <SwiperSlide key={song.id} className="swiper-slide">
                  <img src={images[song.image]} alt={song.title} className="card-image" />
                  <div className="song-title">{song.title}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="controls-column">
            {songs.map((song, index) => (
              <div
                key={song.id}
                ref={(el) => (songRowRefs.current[index] = el)}
                className={`song-row ${index === activeIndex ? 'active-song' : ''}`}
              >
                <img src={images[song.image]} alt={song.title} className="row-thumbnail" />
                <div className="song-info">
                  <div className="song-title-row">{song.title}</div>
                  <div className="singer-name">{song.singer}</div>
                </div>
                <div className="song-meta">
                  <span className="song-duration">{song.duration}</span>
                  <i
                    className={`heart-icon ${song.isFavorite ? 'fas fa-heart' : 'far fa-heart'}`}
                    onClick={() => toggleFavorite(song.id)}
                  ></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="player">
          <audio
            ref={audioRef}
            src={`path/to/your/audio/${songs[activeIndex].title}.mp3`} 
            onTimeUpdate={handleTimeUpdate}
          ></audio>

          <div className="controls">
            <i
              className={`fa-solid fa-shuffle ${isShuffle ? 'active' : ''}`}
              onClick={handleShuffle}
            ></i>
            <i className="fa-solid fa-backward" onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : songs.length - 1))}></i>
            <button id="playPauseBtn" onClick={togglePlayPause}>
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <i className="fa-solid fa-forward" onClick={() => setActiveIndex((prev) => (prev < songs.length - 1 ? prev + 1 : 0))}></i>
            <div className="volume">
              <i className="fa-solid fa-volume-high"></i>
              <input
                type="range"
                id="volume-range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>

          <input
            type="range"
            id="progress-bar"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;