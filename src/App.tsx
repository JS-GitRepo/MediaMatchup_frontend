import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import NavPage from "./components/NavPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/nav/myfeed"
            element={<NavPage currentDisplay="My Feed" />}
          />
          <Route
            path="/nav/friends"
            element={<NavPage currentDisplay="Friends" />}
          />
          <Route
            path="/nav/friends/:id"
            element={<NavPage currentDisplay="Friends" />}
          />
          <Route
            path="/nav/community"
            element={<NavPage currentDisplay="Community" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
