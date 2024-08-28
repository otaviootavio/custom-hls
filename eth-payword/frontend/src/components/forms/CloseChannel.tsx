import { useState } from "react";
import {
  useReadEthWordChannelSender,
  useReadEthWordChannelTip,
  useReadEthWordSimulateCloseChannel,
  useReadEthWordTotalWordCount,
  useWriteEthWordCloseChannel,
} from "../../generated";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import HashchainInput from "../HashchainInput";
import { useHashChainFromExtension } from "../../contexts/wallet/HashChainExtensionProvider";

interface CloseChannelProps {
  address: `0x${string}`;
}

export const CloseChannel: React.FC<CloseChannelProps> = ({ address }) => {
  const account = useAccount();
  const [hexValue, setHexValue] = useState<string>("0x0");
  const [bigIntValue, setBigIntValue] = useState<bigint>(0n);

  const { refetch: refetchChannelTip } = useReadEthWordChannelTip({ address });
  const { refetch: refetchChannelSender } = useReadEthWordChannelSender({
    address,
  });
  const { refetch: refetchTotalWordCount } = useReadEthWordTotalWordCount({
    address,
  });
  const { refetch: refetchBalance } = useBalance({ address });

  const { writeContractAsync, error: errorWrite } =
    useWriteEthWordCloseChannel();
  const { data, error: errorEth } = useReadEthWordSimulateCloseChannel({
    address,
    args: [hexValue as `0x${string}`, bigIntValue as bigint],
    account: account.address,
  });

  const willTxSucess: boolean = data && data[0] ? true : false;

  const { fetchHashChain } = useHashChainFromExtension();
  const [fullHashChain, setFullHashChain] = useState<string[]>([""]);

  if (!address) return;

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (data) {
      // TODO
      // DISPLAY THE ERROS TO USER
      // send error to fix the error
      if (data[1]) {
        // send the transaction
        await writeContractAsync({
          address,
          args: [hexValue as `0x${string}`, bigIntValue as bigint],
          account: account.address,
        });
        refetchChannelSender();
        refetchBalance();
        refetchChannelTip();
        refetchTotalWordCount();
      } else {
        // show error
      }
    }
  };

  const handleFetchHashChain = async () => {
    const hashChain = await fetchHashChain();
    setFullHashChain(hashChain);
    const firstHashToWithdraw = 1;
    setBigIntValue(BigInt(firstHashToWithdraw));
    setHexValue(hashChain[hashChain.length - 1 - firstHashToWithdraw]);
  };

  return (
    <div className="flex flex-col gap-2 w-max-lg">
      <div className="flex flex-row gap-2 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Close Channel</h2>
        </div>
        <div>
          <button
            onClick={handleFetchHashChain}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition flex w-auto items-center text-sm"
          >
            Fetch hash chain from wallet!
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <HashchainInput
          setBigIntValue={setBigIntValue}
          setHexValue={setHexValue}
          bigIntValue={bigIntValue}
          hexValue={hexValue}
          fullHashChain={fullHashChain}
          isManualInput={!fullHashChain.length}
        />
        <input
          type="submit"
          value={willTxSucess ? "Close channel" : "Invalid data"}
          className={`w-full px-4 py-2  text-white rounded  font-bold transition ${
            willTxSucess
              ? "bg-green-500 hover:bg-green-700"
              : "bg-gray-500 hover:bg-gray-700"
          }`}
        />
      </form>
      <p className="text-red-500 max-w-sm break-words">{errorWrite?.message}</p>
      <p className="text-red-500 max-w-sm break-words">{errorEth?.message}</p>

      {willTxSucess && (
        <p className="text-gray-900 p-2 bg-gray-100 rounded-lg border border-gray-300">
          <div className="text-sm">Ammont of tokens to withdraw:</div>
          <div className="text-xl">{data && formatEther(data[1])}</div>
        </p>
      )}
    </div>
  );
};
