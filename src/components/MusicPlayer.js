import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "./MusicPlayer.css";

const MusicPlayer = () => {
  const songs = [
    { id: 1, title: "Dreamy Nights", image: "card-img-1.jpg" },
    { id: 2, title: "Midnight Groove", image: "card-img-2.jpg" },
    { id: 3, title: "Summer Breeze", image: "card-img-3.jpg" },
    { id: 4, title: "Midnight Groove", image: "card-img-4.jpg" },
  ];

  const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  };

  const images = importAll(require.context("../assets", false, /\.(png|jpe?g|svg)$/));

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
            <h1>My Music Player</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;