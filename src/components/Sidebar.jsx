import { categories } from "../utils/constants";

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  return (
    <div>
      {categories.map((cat) => (
        <div
          key={cat.name}
          onClick={() => setSelectedCategory(cat.name)}
          style={{
            padding: "10px",
            cursor: "pointer",
            background:
              selectedCategory === cat.name ? "#eee" : "transparent",
          }}
        >
          <span style={{ marginRight: "10px" }}>{cat.icon}</span>
          {cat.name}
        </div>
      ))}
    </div>
  );
}