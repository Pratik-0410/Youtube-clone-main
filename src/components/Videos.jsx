import React from "react";
import VideoCard from "./VideoCard";

const Videos = ({ videos }) => {
  console.log("VIDEOS ARRAY:", videos); // DEBUG

  return (
    <>
      {videos?.map((item, index) => {
        // 🔥 IMPORTANT FIX
        if (!item.id?.videoId) return null;

        return (
          <div key={index}>
            <VideoCard video={item} />
          </div>
        );
      })}
    </>
  );
};

export default Videos;