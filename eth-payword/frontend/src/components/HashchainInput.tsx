import React from "react";

interface HashchainInputProps {
  fullHashChain: string[];
  setBigIntValue: React.Dispatch<React.SetStateAction<bigint>>;
  setHexValue: React.Dispatch<React.SetStateAction<string>>;
  bigIntValue: bigint;
  hexValue: string;
}

const HashchainInput: React.FC<HashchainInputProps> = ({
  fullHashChain,
  setBigIntValue,
  setHexValue,
  bigIntValue,
  hexValue,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBigIntValue(BigInt(e.target.valueAsNumber));
    setHexValue(
      fullHashChain[fullHashChain.length - e.target.valueAsNumber - 1],
    );
  };
  return (
    <>
      <div className="flex flex-col gap-2 justify-start items-start w-full">
        <div className="w-full">
          <label className="text-gray-700">Number of tokens to withdraw</label>
          <input
            type="number"
            className={`bg-white border rounded-md p-2 w-full text-gray-700 `}
            placeholder="Enter hashchain index"
            onChange={(e) => {
              handleChange(e);
            }}
            value={Number(bigIntValue)}
          />
        </div>
        <div className="w-full">
          <label className="text-gray-700 grow">Hashchain Item</label>
          <input
            type="text"
            className={`bg-white border text-gray-800 rounded-md w-full p-2  `}
            placeholder="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
            value={hexValue}
          />
        </div>
      </div>
    </>
  );
};

export default HashchainInput;
