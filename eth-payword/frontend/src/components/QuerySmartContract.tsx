import { useState } from "react";
import ContractInfo from "./ContractInfo";
import { type Address } from "viem";
import { useHashChainFromExtension } from "../contexts/wallet/HashChainExtensionProvider";

const QuerySmartContract = () => {
  const [address, setAddress] = useState<Address>("0x0");
  const { fetchSmartContractAddress } = useHashChainFromExtension();

  const handleFetchFromExtension = async () => {
    const address = await fetchSmartContractAddress();
    console.log("Address from extension", address);
    setAddress(address as Address);
  };

  return (
    <div className="p-6 flex flex-row w-full bg-white shadow-md space-y-4">
      <div className="flex flex-col w-full ">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl w-max font-bold text-gray-900 mb-4">
            Enter Contract Address
          </h1>
          <button
            onClick={handleFetchFromExtension}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition flex w-auto items-center text-sm"
          >
            Fetch from address from extension
          </button>
        </div>
        <div className="flex flex-col w-full gap-2">
          <p className="text-gray-700 text-md">
            Enter the smart contract address
          </p>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value as `0x${string}`)}
            className="w-full p-2 border border-gray-300 rounded text-gray-900 "
            placeholder="Enter contract address"
          />
          <div>{address && <ContractInfo address={address} />}</div>
        </div>
      </div>
    </div>
  );
};

export default QuerySmartContract;
