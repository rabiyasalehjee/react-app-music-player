import React, { useState } from "react";
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
    { id: 4, title: "Midnight Groove", singer: "Echo Pulse", image: "card-img-4.jpg", duration: "4:00", isFavorite: false },
  ]);

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
              <div key={song.id} className={`song-row ${index === 0 ? 'active-song' : ''}`}>
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
      </div>
    </div>
  );
};

export default MusicPlayer;