import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import Home from "./pages/Home";
import Room from "./pages/Room";
import "./App.css";

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
