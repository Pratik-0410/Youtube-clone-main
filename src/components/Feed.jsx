import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import VideoCard from "./VideoCard";
import { fetchFromAPI } from "../utils/fetchFromAPI";

export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("New");

  useEffect(() => {
    fetchFromAPI(
      `search?part=snippet&q=${selectedCategory}&type=video&maxResults=20`
    ).then((data) => setVideos(data?.items || []));
  }, [selectedCategory]);

  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          borderRight: "1px solid #ddd",
          padding: "10px",
        }}
      >
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* CATEGORY */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {["All", "Music", "Gaming", "ReactJS", "Live"].map((tab) => (
            <button
              key={tab}
              style={{
                padding: "8px 15px",
                borderRadius: "20px",
                border: "none",
                background: "#eee",
                cursor: "pointer",
              }}
              onClick={() => setSelectedCategory(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* VIDEOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {videos.map((item, i) => {
            if (!item?.id?.videoId) return null;
            return <VideoCard key={i} video={item} />;
          })}
        </div>
      </div>
    </div>
  );
}
