const handleSearch = (query) => {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(query);
  localStorage.setItem("history", JSON.stringify(history));
};
export default function SearchHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  return (
    <div>
      <h3>Recent Searches</h3>
      {history.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}