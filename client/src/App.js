import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import BirdCallsPage from './components/BirdCallsPage';
import UserLevelsPage from './components/UserLevelsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact component={HomePage} />
        <Route path="/users/:id" component={UserPage} />
        <Route path="/birdcalls" component={BirdCallsPage} />
        <Route path="/levels" component={UserLevelsPage} />
      </Routes>
    </Router>
  );
}

export default App;