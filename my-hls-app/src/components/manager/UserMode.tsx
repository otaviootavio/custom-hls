import { Hashchain } from "@/hooks/useHashchainFromServer";
import { UpdateServerForm } from "./UpdateServerForm";

export const UserMode = ({
  onFetch,
  onSync,
  hashchainFromServer,
  onUpdate,
  newHash,
  setNewHash,
  newHashChainSize,
  setNewHashChainSize,
}: {
  onFetch: () => void;
  onSync: () => void;
  hashchainFromServer: Hashchain | null;
  onUpdate: () => void;
  newHash: string;
  setNewHash: React.Dispatch<React.SetStateAction<string>>;
  newHashChainSize: number | undefined;
  setNewHashChainSize: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => (
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">User Mode</h2>
    <button
      onClick={onFetch}
      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
    >
      Fetch Payword from Extension
    </button>

    {hashchainFromServer && (
      <button
        onClick={onSync}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Sync Last Hash Send Index
      </button>
    )}
    <UpdateServerForm
      onUpdate={onUpdate}
      newHash={newHash}
      setNewHash={setNewHash}
      newHashChainSize={newHashChainSize}
      setNewHashChainSize={setNewHashChainSize}
    />
  </div>
);
