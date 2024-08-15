import { useState } from "react";
import ContractInfo from "./ContractInfo";
import { type Address } from "viem";

const QuerySmartContract = () => {
  const [address, setAddress] = useState<Address>();

  return (
    <div className="p-6 flex flex-row w-full bg-white shadow-md space-y-4">
      <div className="flex flex-col w-full ">
        <h1 className="text-2xl w-max font-bold text-gray-900 mb-4">
          Enter Contract Address
        </h1>
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
          <div>
            <ContractInfo address={address} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySmartContract;
