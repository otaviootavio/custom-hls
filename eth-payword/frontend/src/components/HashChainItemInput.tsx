import React, { useState } from "react";
import { z } from "zod";
import { useHashChain } from "../contexts/wallet/HashChainExtensionProvider";

// Adjust the regex to validate a hexadecimal hash string
const tailSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid hexadecimal hash");

interface TailInputProps {
  setTail: (value: string) => void;
  tail: string;
}

const TailInput: React.FC<TailInputProps> = ({ setTail, tail }) => {
  const { sendH100Once, h100 } = useHashChain();
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTail(newValue);

    try {
      tailSchema.parse(newValue);
      setError("");
      setTail(newValue);
    } catch (e: any) {
      setError(e.errors[0].message);
    }
  };

  const handleFetchFromWallet = () => {
    sendH100Once();
    if (h100) {
      try {
        tailSchema.parse(h100);
        setError("");
        setTail(h100);
      } catch (e: any) {
        setError(e.errors[0].message);
      }
    }
  };

  return (
    <>
      <label className="text-gray-700">Tail</label>
      <div className="flex flex-row gap-2 justify-between items-center">
        <div className="grow">
          <input
            type="text"
            className={`bg-white border rounded-md p-2 w-full text-gray-700 ${error ? "border-red-500" : "border-gray-300"}`}
            placeholder="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
            value={tail}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition flex w-auto items-center text-sm"
            onClick={handleFetchFromWallet}
          >
            Fetch input from wallet!
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  );
};

export default TailInput;
