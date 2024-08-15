import React, { useState, useEffect } from "react";
import useHaschchainFromServer from "@/hooks/useHashchainFromServer";
import { useHashChainFromExtension } from "@/context/HashChainExtensionProvider";
import { useHashChainContext } from "@/context/HashChainContext";
import { generateHashChain } from "@/utils/HashChainUtils";
import { stringToBytes, toBytes } from "viem";
import { Navbar } from "./manager/NavBar";
import { UserMode } from "./manager/UserMode";
import { AdminMode } from "./manager/AdminMode";
import { toast } from "react-toastify";

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

  useEffect(() => {
    fetchHashchainFromServer();
  }, [fetchHashchainFromServer]);

  const handleUpdateHashchainFromServer = async () => {
    if (newHash && newHashChainSize !== undefined) {
      try {
        toast.info("Updating hashchain on server...");
        await sendTailToServer(newHash, newHashChainSize);
        await fetchHashchainFromServer();
        setNewHash("");
        setNewHashChainSize(undefined);
        toast.success("Hashchain updated successfully!");
      } catch (error) {
        console.error("Error updating payword:", error);
        toast.error("Error updating hashchain. Please try again.", {
          autoClose: 3000,
        });
      }
    }
  };

  const handleFetchHashchainFromExtension = async () => {
    try {
      toast.info("Fetching payword from extension...");
      const data = await fetchSecretAndLength();
      setNewHash(data.tail);
      setNewHashChainSize(data.length);
      toast.success("Payword fetched successfully!");
    } catch (error) {
      console.error("Error fetching payword from extension:", error);
      toast.error("Error fetching payword from extension. Please try again.");
    }
  };

  const handleSyncLastHashSendIndex = async () => {
    //TODO
    //How to verify if the hashchin is already synced?
    try {
      toast.info("Fetching hashchain from server...");
      await fetchHashchainFromServer();
      if (hashchainFromServer) {
        const lastHashSendIndex = hashchainFromServer.mostRecentHashIndex;
        toast.info("Syncing last hash send index...");
        await syncLastHashSendIndex(lastHashSendIndex);
        const extenstionData = await fetchSecretAndLength();
        const hashchain = generateHashChain(
          stringToBytes(extenstionData.secret, { size: 32 }),
          lastHashSendIndex - 1
        );

        setHashChain(hashchain);
        toast.success("Sync completed successfully!");
      }
    } catch (error) {
      console.error("Error syncing last hash send index:", error);
      toast.error("Error syncing last hash send index. Please try again.", {
        autoClose: 3000,
      });
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
