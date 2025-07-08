import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import BoardView from "./pages/BoardView/BoardView";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<BoardView />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
