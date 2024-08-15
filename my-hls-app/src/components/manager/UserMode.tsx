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
    <h2 className="text-xl font-bold ">User Mode</h2>
    <div className="flex-col flex">
      <div>
        <button
          onClick={onFetch}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Fetch Payword from Extension
        </button>
      </div>
      {hashchainFromServer && (
        <div>
          <button
            onClick={onSync}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Sync Last Hash Send Index
          </button>
        </div>
      )}
      {/* Add a status indicating the curret step of the sync process */}
      <UpdateServerForm
        onUpdate={onUpdate}
        newHash={newHash}
        setNewHash={setNewHash}
        newHashChainSize={newHashChainSize}
        setNewHashChainSize={setNewHashChainSize}
      />
    </div>
  </div>
);
