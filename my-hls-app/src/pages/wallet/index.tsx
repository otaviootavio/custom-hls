import ControlButtons from "@/components/wallet/ControlButtons";
import HashChainElementsList from "@/components/wallet/HashChainElementsList";
import { HashChainExtensionProvider } from "@/components/wallet/HashChainExtensionProvider";
import React from "react";

const Page: React.FC = () => {
  return (
    <HashChainExtensionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <ControlButtons />
        <HashChainElementsList />
      </div>
    </HashChainExtensionProvider>
  );
};

export default Page;
