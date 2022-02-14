import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./appDark.css";
import Home from "./pages/Home.js";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route index element={<Home />} />
        {/* <Route path="/user/:username" element={<User />} /> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
