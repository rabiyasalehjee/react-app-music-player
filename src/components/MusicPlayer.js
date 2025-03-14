import React from "react";
import background from "../assets/background-img.jpg";

const MusicPlayer = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    </div>
  );
};

export default MusicPlayer;
