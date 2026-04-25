import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";

export default function Profile() {
  const { user, history, subscriptions } = useContext(AuthContext);
  const [tab, setTab] = useState("history");

  if (!user) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Please login first
      </h2>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      
      {/* USER HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img
          src={`https://ui-avatars.com/api/?name=${user.email}`}
          alt="profile"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
          }}
        />

        <div>
          <h2 style={{ margin: 0 }}>{user.email}</h2>
          <p style={{ color: "gray", margin: 0 }}>Your Channel</p>
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "30px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <p
          onClick={() => setTab("history")}
          style={{
            cursor: "pointer",
            fontWeight: tab === "history" ? "bold" : "normal",
            borderBottom: tab === "history" ? "2px solid red" : "none",
            paddingBottom: "5px",
          }}
        >
          🕘 History
        </p>

        <p
          onClick={() => setTab("subscriptions")}
          style={{
            cursor: "pointer",
            fontWeight: tab === "subscriptions" ? "bold" : "normal",
            borderBottom: tab === "subscriptions" ? "2px solid red" : "none",
            paddingBottom: "5px",
          }}
        >
          📺 Subscriptions
        </p>
      </div>

      {/* CONTENT */}
      <div style={{ marginTop: "20px" }}>
        
        {/* HISTORY */}
        {tab === "history" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {history.length ? (
              history.map((video, i) => (
                <VideoCard key={i} video={video} />
              ))
            ) : (
              <p>No history yet</p>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS */}
        {tab === "subscriptions" && (
          <div>
            {subscriptions.length ? (
              subscriptions.map((sub, i) => (
                <p
                  key={i}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  🔔 {sub}
                </p>
              ))
            ) : (
              <p>No subscriptions</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}