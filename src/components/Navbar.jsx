import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        background: "#fff",
      }}
    >
      {/* LEFT */}
      <h2
        style={{ color: "red", cursor: "pointer", margin: 0 }}
        onClick={() => navigate("/")}
      >
        YouTube
      </h2>

      {/* CENTER */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <SearchBar />
      </div>

      {/* RIGHT */}
      <div
        ref={menuRef}
        style={{
          position: "relative",
          marginLeft: "auto",
        }}
      >
        {/* PROFILE IMAGE (🔥 FIXED FOR FIREBASE) */}
        <img
          src={
            user?.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          onClick={() => setShowMenu((prev) => !prev)}
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />

        {/* DROPDOWN */}
        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "45px",
              right: 0,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              width: "170px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              zIndex: 100,
            }}
          >
            {user ? (
              <>
                {/* USER NAME */}
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {user.displayName}
                </p>

                {/* PROFILE */}
                <p
                  style={{
                    cursor: "pointer",
                    marginBottom: "8px",
                  }}
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                >
                  👤 Profile
                </p>

                {/* LOGOUT */}
                <p
                  style={{
                    color: "red",
                    cursor: "pointer",
                    margin: 0,
                  }}
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                >
                  🚪 Logout
                </p>
              </>
            ) : (
              <p
                style={{ cursor: "pointer", margin: 0 }}
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
              >
                🔑 Login
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}