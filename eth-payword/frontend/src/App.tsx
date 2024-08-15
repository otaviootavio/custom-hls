import { useAccount } from "wagmi";
import DeployContract from "./components/DeployContract";
import QuerySmartContract from "./components/QuerySmartContract";
import { HashChainExtensionProvider } from "./contexts/wallet/HashChainExtensionProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  const { address } = useAccount();
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <header className="bg-white w-full shadow-md p-4 flex justify-between items-center">
          <div className="text-blue-500 text-2xl font-bold bg-white">
            buyHashchain
          </div>
          <ConnectButton />
        </header>
        <main className="flex-grow flex flex-col items-start justify-start gap-10 my-10">
          <HashChainExtensionProvider>
            {address && (
              <>
                <div className="w-full">
                  <DeployContract />
                </div>
                <div className="w-full">
                  <QuerySmartContract />
                </div>
              </>
            )}
          </HashChainExtensionProvider>
        </main>
      </div>
    </>
  );
}

export default App;
