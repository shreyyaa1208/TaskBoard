import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import BoardView from "./pages/BoardView/BoardView";
import BoardDetail from "./pages/BoardDetail/BoardDetail";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<BoardView />} />
            <Route path="/board/:id" element={<BoardDetail />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
