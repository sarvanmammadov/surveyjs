import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Import Routes instead of Switch
import SideBar from "./components/SideBar";
import ExamPage from "./pages/ExamPage";
import ResultsPage from "./pages/ResultsPage";
import CreatorPage from "./pages/CreatorPage";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <SideBar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<ExamPage />} />  
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/create" element={<CreatorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
