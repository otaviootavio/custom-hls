import { UpdateServerForm } from "./UpdateServerForm";

export const UserMode = ({
  onFetch,
  onSync,
  onUpdate,
  newHash,
  setNewHash,
  newHashChainSize,
  setNewHashChainSize,
  newSmartContractAddress,
  setNewSmartContractAddress,
  newChainId,
  setNewChainId,
}: {
  onFetch: () => void;
  onSync: () => void;
  onUpdate: () => void;
  newHash: string;
  setNewHash: React.Dispatch<React.SetStateAction<string>>;
  newHashChainSize: number | undefined;
  setNewHashChainSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  newSmartContractAddress: string;
  setNewSmartContractAddress: React.Dispatch<React.SetStateAction<string>>;
  newChainId: number | undefined;
  setNewChainId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => (
  <div className="p-4 w-full">
    <div className="flex-col flex">
      <div className="flex flex-row gap-2 justify-between items-center">
        <div>
          <button
            onClick={onFetch}
            className="bg-blue-500 text-white px-4 py-2 rounded "
          >
            Fetch from Extension
          </button>
        </div>
        <button
          onClick={onSync}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sync Extension
        </button>
      </div>

      <UpdateServerForm
        onUpdate={onUpdate}
        newHash={newHash}
        setNewHash={setNewHash}
        newHashChainSize={newHashChainSize}
        setNewHashChainSize={setNewHashChainSize}
        newSmartContractAddress={newSmartContractAddress}
        setNewSmartContractAddress={setNewSmartContractAddress}
        newChainId={newChainId}
        setNewChainId={setNewChainId}
      />
    </div>
  </div>
);
