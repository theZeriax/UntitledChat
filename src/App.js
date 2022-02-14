import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./appDark.css";
import Home from "./pages/Home.js";
import PageNotFound from "./pages/PageNotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Tos from "./pages/Tos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/user/:username" /> */}
        <Route path="tos" element={<Tos />} />
        <Route path="privacypolicy" element={<PrivacyPolicy />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
