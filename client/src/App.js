import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
//import UserPage from './components/UserPage';
//import BirdCallsPage from './components/BirdCallsPage';
//import UserLevelsPage from './components/UserLevelsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}