import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { AuthContext } from "../context/AuthContext";
import Recommended from "./Recommended";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebaseconfig";

const VideoDetail = () => {
  const { id } = useParams();

  const [videoDetail, setVideoDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  const { addToHistory, user, subscribe, subscriptions } =
    useContext(AuthContext);

  // ✅ FETCH VIDEO
  useEffect(() => {
    let mounted = true;

    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => {
        if (!mounted) return;

        const videoData = data?.items?.[0];
        setVideoDetail(videoData || null);

        if (videoData && addToHistory) {
          addToHistory({
            id: { videoId: videoData.id },
            snippet: videoData.snippet,
          });
        }
      })
      .catch(console.log);

    return () => {
      mounted = false;
    };
  }, [id]);

  // ✅ COMMENTS (SAFE)
  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "comments"),
      where("videoId", "==", id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setComments(data);
    });

    return () => unsubscribe();
  }, [id]);

  // ✅ ADD COMMENT
  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        text: comment,
        videoId: id,
        userName: user?.displayName || user?.email || "Guest",
        userPhoto: user?.photoURL || "",
        createdAt: serverTimestamp(),
      });

      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ SUBSCRIBE (NO FREEZE FIX)
  const handleSubscribe = () => {
    if (!videoDetail || subLoading) return;

    const channel = videoDetail?.snippet?.channelTitle;
    if (!channel) return;

    setSubLoading(true);

    // 🔥 VERY IMPORTANT: async without blocking UI
    setTimeout(() => {
      subscribe?.(channel);
      setSubLoading(false);
    }, 0);
  };

  // ✅ LOADING
  if (!videoDetail) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  const title = videoDetail?.snippet?.title || "No title";
  const channelTitle = videoDetail?.snippet?.channelTitle || "Unknown";

  const viewCount = Number(videoDetail?.statistics?.viewCount || 0);
  const likeCount = Number(videoDetail?.statistics?.likeCount || 0);

  const isSubscribed =
    subscriptions?.includes(channelTitle) || false;

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      
      {/* LEFT */}
      <div style={{ flex: 3 }}>

        {/* ✅ FIXED PLAYER (NO FREEZE) */}
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        <h3 style={{ marginTop: "10px" }}>{title}</h3>

        {/* ✅ SUBSCRIBE BUTTON */}
        <button
          onClick={handleSubscribe}
          disabled={subLoading}
          style={{
            padding: "8px 16px",
            background: isSubscribed ? "gray" : "#cc0000",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: subLoading ? "not-allowed" : "pointer",
            marginBottom: "10px",
          }}
        >
          {subLoading
            ? "Loading..."
            : isSubscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>

        <p style={{ color: "gray", fontSize: "14px" }}>
          {channelTitle} •{" "}
          {viewCount.toLocaleString()} views •{" "}
          {likeCount.toLocaleString()} likes
        </p>

        {/* COMMENTS */}
        <div style={{ marginTop: "20px" }}>
          <h4>Comments</h4>

          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "20px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleComment}
              style={{
                padding: "10px 20px",
                background: "#ff0000",
                color: "white",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              Comment
            </button>
          </div>

          {comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={
                    c.userPhoto ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt=""
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                  }}
                />

                <div>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "13px" }}>
                    {c.userName}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    {c.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1.2, marginLeft: "20px" }}>
        <h4>Recommended</h4>
        <Recommended videoId={id} />
      </div>
    </div>
  );
};

export default VideoDetail;