import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "./Sidebar";
import VideoCard from "./VideoCard";
import { fetchFromAPI } from "../utils/fetchFromAPI";

export default function SearchFeed() {
  const { searchTerm } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!searchTerm) return;

    fetchFromAPI(
      `search?part=snippet&q=${searchTerm}&type=video&maxResults=20`
    ).then((data) => setVideos(data?.items || []));
  }, [searchTerm]);

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
        <Sidebar />
      </div>

      {/* RESULTS */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>
          Search Results for:{" "}
          <span style={{ color: "red" }}>{searchTerm}</span>
        </h2>

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