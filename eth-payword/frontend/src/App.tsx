import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HashChainExtensionProvider } from "./contexts/wallet/HashChainExtensionProvider";
import DeployContract from "./components/DeployContract";
import QuerySmartContract from "./components/QuerySmartContract";

function App() {
  const { address } = useAccount();
  const [currentPage, setCurrentPage] = useState<"open" | "close">("open");

  const renderPage = () => {
    switch (currentPage) {
      case "open":
        return <DeployContract />;
      case "close":
        return <QuerySmartContract />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      <header className="bg-white w-full shadow-md p-4 flex justify-between items-center">
        <div className="text-blue-500 text-2xl font-bold">buyHashchain</div>
        <ConnectButton />
      </header>
      <main className="my-10 flex flex-col w-full justify-center items-center">
        {address ? (
          <HashChainExtensionProvider>
            <div className="max-w-3xl w-full">
              <nav className="bg-white shadow-sm w-full">
                <ul className="flex">
                  <li>
                    <button
                      className={`px-4 py-2 ${currentPage === "open" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                      onClick={() => setCurrentPage("open")}
                    >
                      Open Channel
                    </button>
                  </li>
                  <li>
                    <button
                      className={`px-4 py-2 ${currentPage === "close" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                      onClick={() => setCurrentPage("close")}
                    >
                      Close Channel
                    </button>
                  </li>
                </ul>
              </nav>
              {address && <div>{renderPage()}</div>}
            </div>
          </HashChainExtensionProvider>
        ) : (
          <div className="p-2 text-slate-600 rounded-xl shadow flex flex-col justify-start items-start bg-slate-50 border border-slate-200">
            <p className="font-semibold text-xl">Error!</p>
            <p>Please connect your wallet to continue</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
