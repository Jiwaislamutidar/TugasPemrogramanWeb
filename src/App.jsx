import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/homepage";
import Aspirasi from "./pages/aspirasi";
import LostFound from "./pages/lostfound";

// biar tiap pindah halaman scroll balik ke atas
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aspirasi" element={<Aspirasi />} />
        <Route path="/lostfound" element={<LostFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;