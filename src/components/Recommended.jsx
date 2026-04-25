import { useEffect, useState } from "react";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import VideoCard from "./VideoCard";

export default function Recommended({ videoId }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // ❌ REMOVE relatedToVideoId (BROKEN)
    // ✅ USE TITLE BASED SEARCH (REALISTIC + WORKING)

    fetchFromAPI(`search?part=snippet&q=music&type=video&maxResults=20`)
      .then((data) => {
        setVideos(data.items || []);
      });
  }, [videoId]);

  if (!videos.length) {
    return <p style={{ padding: "10px" }}>Loading recommended videos...</p>;
  }

  return (
    <div>
      {videos.map((item, i) => (
        <VideoCard key={i} video={item} />
      ))}
    </div>
  );
}