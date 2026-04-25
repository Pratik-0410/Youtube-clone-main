import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  // ✅ SAFE FALLBACKS
  const videoId =
    video?.id?.videoId ||
    video?.id ||
    "dQw4w9WgXcQ";

  const thumbnail =
    video?.snippet?.thumbnails?.medium?.url ||
    "https://via.placeholder.com/320x180?text=No+Image";

  const title =
    video?.snippet?.title || "No Title";

  const channel =
    video?.snippet?.channelTitle || "Unknown Channel";

  return (
    <Link to={`/video/${videoId}`} style={{ textDecoration: "none", color: "black" }}>
      <div style={{ width: "300px", cursor: "pointer" }}>
        
        {/* THUMBNAIL */}
        <img
          src={thumbnail}
          alt={title}
          style={{
            width: "100%",
            borderRadius: "10px",
          }}
        />

        {/* TITLE */}
        <h4 style={{ fontSize: "14px", margin: "10px 0 5px" }}>
          {title}
        </h4>

        {/* CHANNEL */}
        <p style={{ fontSize: "12px", color: "gray" }}>
          {channel}
        </p>
      </div>
    </Link>
  );
};

export default VideoCard;