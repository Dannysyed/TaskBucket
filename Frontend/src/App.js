import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/NotFound" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
