import axios from "axios";
import { db } from "../firebaseconfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

// ✅ memory cache (fast)
const cache = {};

export const fetchFromAPI = async (url) => {
  try {
    // ✅ 1. MEMORY CACHE
    if (cache[url]) {
      console.log("⚡ Using memory cache:", url);
      return cache[url];
    }

    // ✅ 2. FIREBASE CACHE
    const docRef = doc(db, "youtube_cache", url);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      console.log("🔥 Using Firebase cache:", url);
      const data = snap.data();

      cache[url] = data; // also store in memory
      return data;
    }

    // ✅ 3. API CALL (ONLY IF NOT CACHED)
    const { data } = await axios.get(`${BASE_URL}/${url}`, {
      params: {
        key: API_KEY,
        part: "snippet",
        maxResults: 25,
      },
    });

    // ✅ SAVE TO BOTH CACHES
    cache[url] = data;
    await setDoc(docRef, data);

    return data;

  } catch (error) {
    const errData = error.response?.data;

    console.error("API ERROR:", errData || error.message);

    // 🚨 QUOTA EXCEEDED HANDLING
    if (errData?.error?.errors?.[0]?.reason === "quotaExceeded") {
      console.warn("🚨 QUOTA EXCEEDED → Using fallback");

      return {
        items: [
          {
            id: { videoId: "dQw4w9WgXcQ" },
            snippet: {
              title: "API limit reached 😅 Try again later",
              channelTitle: "System",
              thumbnails: {
                medium: {
                  url: "https://via.placeholder.com/320x180?text=No+Data",
                },
              },
            },
          },
        ],
      };
    }

    // ❌ OTHER ERRORS
    return { items: [] };
  }
};

console.log("API KEY:", API_KEY);
