import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        background: "#f1f1f1",
        borderRadius: "20px",
        padding: "5px 10px",
        width: "40%",
      }}
    >
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          flex: 1,
        }}
      />

      <button type="submit" style={{ border: "none", background: "transparent" }}>
        🔍
      </button>
    </form>
  );
}