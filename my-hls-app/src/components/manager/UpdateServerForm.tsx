export const UpdateServerForm = ({
  onUpdate,
  newHash,
  setNewHash,
  newHashChainSize,
  setNewHashChainSize,
}: {
  onUpdate: () => void;
  newHash: string;
  setNewHash: React.Dispatch<React.SetStateAction<string>>;
  newHashChainSize: number | undefined;
  setNewHashChainSize: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => (
  <div className="mt-4">
    <h3 className="font-bold">Update Server Data:</h3>
    <input
      type="text"
      value={newHash}
      onChange={(e) => setNewHash(e.target.value)}
      placeholder="Enter new hash"
      className="border p-2 mr-2"
    />
    <input
      type="number"
      value={newHashChainSize !== undefined ? newHashChainSize : ""}
      onChange={(e) => setNewHashChainSize(parseInt(e.target.value))}
      placeholder="Enter chain size"
      className="border p-2 mr-2"
    />
    <button
      onClick={onUpdate}
      className="bg-green-500 text-white px-4 py-2 rounded"
    >
      Update Payword
    </button>
  </div>
);
