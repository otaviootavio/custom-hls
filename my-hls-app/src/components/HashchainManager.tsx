import React, { useState, useEffect } from "react";
import useHaschchainFromServer from "@/hooks/useHashchainFromServer";
import { useHashChainFromExtension } from "@/context/HashChainExtensionProvider";
import { useHashChainContext } from "@/context/HashChainContext";
import { generateHashChain } from "@/utils/HashChainUtils";
import { stringToBytes, toBytes } from "viem";
import { Navbar } from "./manager/NavBar";
import { UserMode } from "./manager/UserMode";
import { AdminMode } from "./manager/AdminMode";

const HashchainManager: React.FC = () => {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const {
    hashchainFromServer,
    error,
    loading,
    fetchHashchainFromServer,
    sendTailToServer,
  } = useHaschchainFromServer();
  const [newHash, setNewHash] = useState("");
  const [newHashChainSize, setNewHashChainSize] = useState<
    number | undefined
  >();
  const { fetchSecretAndLength, syncLastHashSendIndex } =
    useHashChainFromExtension();
  const { setHashChain } = useHashChainContext();
  const [extensionData, setExtensionData] = useState<{
    secret: string;
    length: number;
    tail: string;
    lastHashSendIndex: number;
  } | null>(null);

  useEffect(() => {
    fetchHashchainFromServer();
  }, [fetchHashchainFromServer]);

  const handleUpdateHashchainFromServer = async () => {
    if (newHash && newHashChainSize !== undefined) {
      try {
        await sendTailToServer(newHash, newHashChainSize);
        await fetchHashchainFromServer();
        setNewHash("");
        setNewHashChainSize(undefined);
      } catch (error) {
        console.error("Error updating payword:", error);
      }
    }
  };

  const handleFetchHashchainFromExtension = async () => {
    try {
      const data = await fetchSecretAndLength();
      setExtensionData(data);
      setNewHash(data.tail);
      setNewHashChainSize(data.length);
    } catch (error) {
      console.error("Error fetching payword from extension:", error);
    }
  };

  const handleSyncLastHashSendIndex = async () => {
    fetchHashchainFromServer();
    if (hashchainFromServer) {
      const lastHashSendIndex = hashchainFromServer.mostRecentHashIndex;
      await syncLastHashSendIndex(lastHashSendIndex);
      const extenstionData = await fetchSecretAndLength();
      const hashchain = generateHashChain(
        stringToBytes(extenstionData.secret, { size: 32 }),
        lastHashSendIndex - 1
      );
      setHashChain(hashchain);
    }
  };

  return (
    <div className="bg-gray-200 p-4 max-w-2xl">
      <Navbar setMode={setMode} currentMode={mode} />
      {mode === "user" ? (
        <UserMode
          onFetch={handleFetchHashchainFromExtension}
          onSync={handleSyncLastHashSendIndex}
          hashchainFromServer={hashchainFromServer}
          onUpdate={handleUpdateHashchainFromServer}
          newHash={newHash}
          setNewHash={setNewHash}
          newHashChainSize={newHashChainSize}
          setNewHashChainSize={setNewHashChainSize}
        />
      ) : (
        <AdminMode
          hashchainFromServer={hashchainFromServer}
          loading={loading}
          error={error}
          onRefetch={fetchHashchainFromServer}
          onUpdate={handleUpdateHashchainFromServer}
          newHash={newHash}
          setNewHash={setNewHash}
          newHashChainSize={newHashChainSize}
          setNewHashChainSize={setNewHashChainSize}
        />
      )}
    </div>
  );
};

export default HashchainManager;
