import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import MatchupFeed from "./components/MatchupFeed";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/myfeed" element={<MatchupFeed />} />
          {/* <Route path="/gifs/search" element={<Main />} />
          <Route path="/gifs/:id/details" element={<Details />} />
          <Route path="/gifs/favorites" element={<Favorites />} />
          <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
