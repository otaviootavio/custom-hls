import { Hashchain } from "@/hooks/useHashchainFromServer";
import SingleHashView from "../SingleHashView";
import { formatEther } from "viem";
import { defaultChains, getChainById } from "@/lib/supportedChain";

export const AdminMode = ({
  hashchainFromServer,
  loading,
  error,
  onRefetch,
  exportHashChainToExtension,
}: {
  hashchainFromServer: Hashchain | null;
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onUpdate: () => void;
  tail: string;
  setTail: React.Dispatch<React.SetStateAction<string>>;
  newHashChainSize: number | undefined;
  setNewHashChainSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  exportHashChainToExtension: () => Promise<void>;
}) => (
  <div className="p-4 w-full">
    {loading && <p>Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {hashchainFromServer && (
      <div className="text-slate-800">
        <div className="flex flex-row justify-between items-center">
          <h3 className="font-bold mt-4">Server Data:</h3>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={exportHashChainToExtension}
          >
            Export to Extension
          </button>
        </div>
        <p>
          Last Hash: <SingleHashView hash={hashchainFromServer.lastHash} />
        </p>
        <p>Chain Size: {hashchainFromServer.chainSize}</p>
        <p>
          Most Recent Hash:{" "}
          <SingleHashView hash={hashchainFromServer.mostRecentHash} />
        </p>
        <p>
          Index of Most Recent Hash: {hashchainFromServer.mostRecentHashIndex}
        </p>
        <p>Chain Id: {hashchainFromServer.chainId}</p>
        <p>
          Smart Contract Address:{" "}
          <SingleHashView hash={hashchainFromServer.smartContractAddress} />
        </p>
        <p>
          Amount: {formatEther(BigInt(hashchainFromServer.amount))}{" "}
          {
            getChainById(defaultChains, hashchainFromServer.chainId)
              ?.nativeCurrency.symbol
          }
        </p>
        <p>
          Network:{" "}
          {getChainById(defaultChains, hashchainFromServer.chainId)?.name}
        </p>
      </div>
    )}
    <button
      onClick={onRefetch}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      Refetch
    </button>
  </div>
);
