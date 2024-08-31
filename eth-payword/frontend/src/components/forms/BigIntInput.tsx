import { Dispatch, SetStateAction, useState } from "react";

export function BigIntInput({
  onBigIntChange,
}: {
  onBigIntChange: Dispatch<SetStateAction<bigint>>;
}) {
  const [value, setValue] = useState("");

  const handleChange = (e: { target: { value: string } }) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (newValue === "") {
      onBigIntChange(BigInt(0));
      return;
    }

    try {
      const floatValue = parseFloat(newValue);
      if (isNaN(floatValue)) {
        throw new Error("Invalid number");
      }
      const bigIntValue = BigInt(Math.floor(floatValue * 1e18));
      onBigIntChange(bigIntValue);
    } catch (error) {
      console.error("Error parsing number to BigInt");
    }
  };

  return (
    <div className="w-full">
      <input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder="Enter a number (e.g., 0.0069)"
        step="any"
        className="bg-white border border-gray-300 rounded-md p-2 w-full text-gray-700"
      />
    </div>
  );
}
