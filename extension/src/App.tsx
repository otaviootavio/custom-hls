import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GenerateHash from "./components/GenerateHash";
import HashManagement from "./components/HashManagement";
import HashChainDetail from "./components/HashChainDetail";

function App() {
  return (
    <Router>
      <div className="min-h-96 min-w-56  bg-gray-800 text-gray-200">
        <nav className="bg-gray-900 p-4">
          <ul className="flex justify-center space-x-4">
            <li>
              <Link to="/generate" className="hover:text-indigo-400">
                Generate Hash
              </Link>
            </li>
            <li>
              <Link to="/manage" className="hover:text-indigo-400">
                Manage Hash
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/generate" element={<GenerateHash />} />
            <Route path="/manage" element={<HashManagement />} />
            <Route path="/hashchain/:key" element={<HashChainDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
