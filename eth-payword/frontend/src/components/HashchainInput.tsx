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
      <div className="flex flex-row gap-2 justify-between items-center">
        <label className="text-gray-700">Number of tokens to withdraw</label>
        <div className="grow">
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
      </div>

      <div className="flex flex-row gap-2 justify-between items-center">
        <label className="text-gray-700 grow">Hashchain Item</label>
        <input
          type="text"
          className={`bg-white border text-gray-800 rounded-md grow p-2  `}
          placeholder="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
          value={hexValue}
        />
      </div>
    </>
  );
};

export default HashchainInput;
