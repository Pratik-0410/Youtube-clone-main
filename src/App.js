import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import {
  Feed,
  VideoDetail,
  ChannelDetail,
  SearchFeed,
  Navbar,
} from "./components";

import Login from "./pages/login";
import Profile from "./pages/Profile";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Hide Navbar only on login */}
      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/channel/:id" element={<ChannelDetail />} />
        <Route path="/search/:searchTerm" element={<SearchFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}