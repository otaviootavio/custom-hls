import { HashchainDebug } from "./components/HashchainDebug";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <main>
          <HashchainDebug />
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default App;