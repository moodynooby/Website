import React from 'react';
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import EventPage from './pages/Events/EventPage';
import AchievementPage from './pages/Achievements/AchievementPage';
import CommitteePage from './pages/Committee/CommitteePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/committee" element={<CommitteePage />} />
        <Route path="/achievements" element={<AchievementPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
