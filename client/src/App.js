import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import BirdCallsPage from './components/BirdCallsPage';
import UserLevelsPage from './components/UserLevelsPage';
import ReviewPage from './components/ReviewsPage';
import NotFoundPage from './components/NotFoundPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/birdcalls" element={<BirdCallsPage />} />
        <Route path="/userlevels" element={<UserLevelsPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}