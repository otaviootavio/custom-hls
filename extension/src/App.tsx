import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GenerateHash from "./components/GenerateHash";
import HashManagement from "./components/HashManagement";
import HashChainDetail from "./components/HashChainDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/generate">Generate Hash</Link>
            </li>
            <li>
              <Link to="/manage">Manage Hash</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/generate" element={<GenerateHash />} />
          <Route path="/manage" element={<HashManagement />} />
          <Route path="/hashchain/:key" element={<HashChainDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
