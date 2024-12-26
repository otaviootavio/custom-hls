import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import GenerateHash from "./components/GenerateHash";
import HashManagement from "./components/HashManagement";
import HashChainDetail from "./components/HashChainDetail";
import { HashChainProvider } from "./context/HashChainContext";

function Popup() {
  return (
    <HashChainProvider>
      <Router>
        <div className="bg-gray-800 w-[300px] h-[500px] text-gray-200">
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
              <Route path="*" element={<Navigate to="/manage" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </HashChainProvider>
  );
}

export default Popup;
