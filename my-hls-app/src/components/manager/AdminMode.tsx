import { Hashchain } from "@/hooks/useHashchainFromServer";
import SingleHashView from "../SingleHashView";

export const AdminMode = ({
  hashchainFromServer,
  loading,
  error,
  onRefetch,
}: {
  hashchainFromServer: Hashchain | null;
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onUpdate: () => void;
  newHash: string;
  setNewHash: React.Dispatch<React.SetStateAction<string>>;
  newHashChainSize: number | undefined;
  setNewHashChainSize: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => (
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Admin Mode</h2>
    {loading && <p>Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {hashchainFromServer && (
      <div>
        <h3 className="font-bold mt-4">Server Data:</h3>
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
      </div>
    )}
    <button
      onClick={onRefetch}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      Refetch Payword
    </button>
  </div>
);
