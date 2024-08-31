export const UpdateServerForm = ({
  onUpdate,
  tail,
  setTail,
  newHashChainSize,
  setNewHashChainSize,
  newSmartContractAddress,
  setNewSmartContractAddress,
  newChainId,
  setNewChainId,
  toAddress,
  setToAddress,
  amount,
  setAmount,
}: {
  onUpdate: () => void;
  tail: string;
  setTail: React.Dispatch<React.SetStateAction<string>>;
  newHashChainSize: number | undefined;
  setNewHashChainSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  newSmartContractAddress: string;
  setNewSmartContractAddress: React.Dispatch<React.SetStateAction<string>>;
  newChainId: number | undefined;
  setNewChainId: React.Dispatch<React.SetStateAction<number | undefined>>;
  toAddress: string;
  setToAddress: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="mt-4 flex flex-col">
    <h3 className="font-bold text-slate-800">Send data to server:</h3>
    <div className="gap-2 flex flex-col">
      <input
        type="text"
        value={tail}
        onChange={(e) => setTail(e.target.value)}
        placeholder="Enter tail"
        className="border p-2 mr-2"
      />
      <input
        type="number"
        value={newHashChainSize !== undefined ? newHashChainSize : ""}
        onChange={(e) => setNewHashChainSize(parseInt(e.target.value))}
        placeholder="Enter chain size"
        className="border p-2 mr-2"
      />
      <input
        type="text"
        value={newSmartContractAddress}
        onChange={(e) => setNewSmartContractAddress(e.target.value)}
        placeholder="Enter smart contract address"
        className="border p-2 mr-2"
      />
      <input
        type="number"
        value={newChainId !== undefined ? newChainId : ""}
        onChange={(e) => setNewChainId(parseInt(e.target.value))}
        placeholder="Enter chain id"
        className="border p-2 mr-2"
      />

      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border p-2 mr-2"
      />

      <input
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        placeholder="Enter to address"
        className="border p-2 mr-2"
      />
      <button
        onClick={onUpdate}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  </div>
);
