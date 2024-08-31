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
import { VendorData } from "./VendorData";

const HashchainManager: React.FC = () => {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const {
    hashchainFromServer,
    error,
    loading,
    fetchHashchainFromServer,
    sendTailToServer,
  } = useHaschchainFromServer();

  const [tail, setTail] = useState("");
  const [newHashChainSize, setNewHashChainSize] = useState<
    number | undefined
  >();
  const {
    fetchToAddress,
    fetchAmount,
    fetchSecretAndLength,
    syncLastHashSendIndex,
    fetchSmartContractAddress,
    fetchChainId,
    userExportHashChainToExtension,
  } = useHashChainFromExtension();
  const { setHashChain } = useHashChainContext();
  const [newSmartContractAddress, setNewSmartContractAddress] = useState("");
  const [newChainId, setNewChainId] = useState<number | undefined>();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchHashchainFromServer();
  }, [fetchHashchainFromServer]);

  const handleUpdateHashchainFromServer = async () => {
    if (tail && newHashChainSize !== undefined) {
      try {
        toast.info("Updating hashchain on server...");

        if (!newChainId || !newSmartContractAddress) {
          toast.error("Chain id or smart contract address not set");
          throw new Error("Chain id or smart contract address not set");
        }

        await sendTailToServer(
          tail,
          newHashChainSize,
          newChainId,
          newSmartContractAddress,
          toAddress,
          amount
        );
        await fetchHashchainFromServer();
        setTail("");
        setNewHashChainSize(undefined);
        setNewChainId(undefined);
        setNewSmartContractAddress("");
        toast.success("Hashchain updated successfully!");
      } catch (error) {
        console.error("Error updating payword:", error);
        toast.error("Error updating hashchain. Please try again.", {
          autoClose: 3000,
        });
      }
    }
  };

  const exportHashChainToExtension = async () => {
    if (
      !!hashchainFromServer?.mostRecentHash &&
      !!hashchainFromServer?.mostRecentHashIndex &&
      !!hashchainFromServer?.chainSize &&
      !!hashchainFromServer?.chainId &&
      !!hashchainFromServer?.smartContractAddress
    ) {
      await userExportHashChainToExtension(
        hashchainFromServer.mostRecentHash as `0x${string}`,
        hashchainFromServer.mostRecentHashIndex,
        hashchainFromServer.chainSize,
        hashchainFromServer.chainId as number,
        hashchainFromServer.smartContractAddress as `0x${string}`
      );
    } else {
      toast.error("Failed to export hash chain to extension");
    }
  };

  const handleFetchHashchainFromExtension = async () => {
    try {
      toast.info("Fetching payword from extension...");
      const { tail, length } = await fetchSecretAndLength();
      setTail(tail);
      setNewHashChainSize(length);

      const smartContractAddress = await fetchSmartContractAddress();
      setNewSmartContractAddress(smartContractAddress);

      const chainId = await fetchChainId();
      setNewChainId(chainId);

      const toAddress = await fetchToAddress();
      setToAddress(toAddress);

      const amount = await fetchAmount();
      setAmount(amount);

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
    <div className="bg-gray-200 p-4 w-full gap-2 flex flex-col ">
      <Navbar setMode={setMode} currentMode={mode} />
      <VendorData />
      {mode === "user" ? (
        <UserMode
          onFetch={handleFetchHashchainFromExtension}
          onSync={handleSyncLastHashSendIndex}
          onUpdate={handleUpdateHashchainFromServer}
          tail={tail}
          setTail={setTail}
          toAddress={toAddress}
          setToAddress={setToAddress}
          amount={amount}
          setAmount={setAmount}
          newHashChainSize={newHashChainSize}
          setNewHashChainSize={setNewHashChainSize}
          newSmartContractAddress={newSmartContractAddress}
          setNewSmartContractAddress={setNewSmartContractAddress}
          newChainId={newChainId}
          setNewChainId={setNewChainId}
        />
      ) : (
        <AdminMode
          hashchainFromServer={hashchainFromServer}
          loading={loading}
          error={error}
          onRefetch={fetchHashchainFromServer}
          onUpdate={handleUpdateHashchainFromServer}
          tail={tail}
          setTail={setTail}
          newHashChainSize={newHashChainSize}
          setNewHashChainSize={setNewHashChainSize}
          exportHashChainToExtension={exportHashChainToExtension}
        />
      )}
    </div>
  );
};

export default HashchainManager;
