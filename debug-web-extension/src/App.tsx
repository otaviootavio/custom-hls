import React from "react";
import { HashchainDebug } from "./components/HashchainDebug";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <header className="py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hashchain Debug Tool
          </h1>
        </header>

        <main>
          <HashchainDebug />
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default App;