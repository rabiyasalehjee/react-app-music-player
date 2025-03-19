import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "./MusicPlayer.css";

import song1 from "../assets/songs/mp3-1.mp3";
import song2 from "../assets/songs/mp3-2.mp3";
import song3 from "../assets/songs/mp3-3.mp3";
import song4 from "../assets/songs/mp3-4.mp3";
import song5 from "../assets/songs/mp3-5.mp3";

const MusicPlayer = () => {
  const songFiles = [song1, song2, song3, song4, song5];

  const [songs, setSongs] = useState([
    { id: 1, title: "Dreamy Nights", singer: "Luna Vox", image: "card-img-1.jpg", duration: "3:45", isFavorite: false, src: songFiles[0] },
    { id: 2, title: "Midnight Groove", singer: "Stellar Beats", image: "card-img-2.jpg", duration: "4:12", isFavorite: false, src: songFiles[1] },
    { id: 3, title: "Summer Breeze", singer: "Solar Tunes", image: "card-img-3.jpg", duration: "3:30", isFavorite: true, src: songFiles[2] },
    { id: 4, title: "Starlight Serenade", singer: "Echo Pulse", image: "card-img-4.jpg", duration: "4:00", isFavorite: false, src: songFiles[3] },
    { id: 5, title: "Neon Dreams", singer: "Synthwave Collective", image: "card-img-5.jpg", duration: "4:10", isFavorite: false, src: songFiles[4] },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); 
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(new Audio(songs[0].src));
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

  
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = songs[activeIndex].src;
    audio.load();

    if (isPlaying || isShuffle) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Autoplay prevented:", error);
          setIsPlaying(false);
        });
    }

    if (swiperRef.current) {
      swiperRef.current.slideTo(activeIndex);
    }

    const activeRow = songRowRefs.current[activeIndex];
    if (activeRow) {
      const timeoutId = setTimeout(() => {
        activeRow.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [activeIndex, isShuffle, songs]);

  
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume / 100;

    if (!isShuffle) {
      if (isPlaying) {
        audio.play().catch((e) => console.error("Error playing audio:", e));
      } else {
        audio.pause();
      }
    }

    const handleEnded = () => {
      setActiveIndex((prev) => (prev < songs.length - 1 ? prev + 1 : 0));
      setIsPlaying(true); 
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [isPlaying, volume, isMuted, songs.length, isShuffle]);

  const toggleFavorite = (id) => {
    setSongs(songs.map((song) =>
      song.id === id ? { ...song, isFavorite: !song.isFavorite } : song
    ));
  };

  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
  };

  const handleRowClick = (index) => {
    setActiveIndex(index);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleShuffle = () => {
    const newShuffleState = !isShuffle;
    setIsShuffle(newShuffleState);
    if (newShuffleState) {
      const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
      setSongs(shuffledSongs);
      setActiveIndex(0);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    setIsMuted(false);
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 0;
    setProgress((currentTime / duration) * 100 || 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
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
              cardsEffect={{ perSlideOffset: 9, perSlideRotate: 3 }}
              speed={700}
              initialSlide={0}
              className="swiper"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
            >
              {songs.map((song) => (
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
                className={`song-row ${index === activeIndex ? "active-song" : ""}`}
                onClick={() => handleRowClick(index)}
                style={{ cursor: "pointer" }}
              >
                <img src={images[song.image]} alt={song.title} className="row-thumbnail" />
                <div className="song-info">
                  <div className="song-title-row">{song.title}</div>
                  <div className="singer-name">{song.singer}</div>
                </div>
                <div className="song-meta">
                  <span className="song-duration">{song.duration}</span>
                  <i
                    className={`heart-icon ${song.isFavorite ? "fas fa-heart" : "far fa-heart"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song.id);
                    }}
                  ></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="player">
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />

          <div className="controls">
            <i
              className={`fa-solid fa-shuffle ${isShuffle ? "active" : ""}`}
              onClick={handleShuffle}
            ></i>
            <i
              className="fa-solid fa-backward"
              onClick={() => {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : songs.length - 1));
                setIsPlaying(true); 
              }}
            ></i>
            <button id="playPauseBtn" onClick={togglePlayPause}>
              <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
            </button>
            <i
              className="fa-solid fa-forward"
              onClick={() => {
                setActiveIndex((prev) => (prev < songs.length - 1 ? prev + 1 : 0));
                setIsPlaying(true); 
              }}
            ></i>
            <div className="volume">
              <i
                className={`fa-solid ${isMuted ? "fa-volume-mute" : "fa-volume-high"}`}
                onClick={toggleMute}
              ></i>
              <input
                type="range"
                id="volume-range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
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