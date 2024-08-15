import {
  useReadEthWordChannelRecipient,
  useReadEthWordChannelSender,
  useReadEthWordChannelTip,
  useReadEthWordTotalWordCount,
} from "../generated";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { z } from "zod";
import { CloseChannel } from "./forms/CloseChannel";

interface ContractInfoProps {
  address: `0x${string}` | undefined;
}

const addressSchema = z
  .string()
  .refine((val) => val.startsWith("0x"))
  .refine((val) => val.length === 42)
  .transform((val) => `0x${val.slice(2)}` as `0x${string}`);

const ContractInfo: React.FC<ContractInfoProps> = ({ address }) => {
  const { data: channelRecipient } = useReadEthWordChannelRecipient({
    address,
  });
  const { data: channelTip } = useReadEthWordChannelTip({ address });
  const { data: channelSender } = useReadEthWordChannelSender({ address });
  const { data: totalWordCount } = useReadEthWordTotalWordCount({ address });
  const { data: balance } = useBalance({ address });

  const ethWordData = {
    channelRecipient,
    channelTip,
    channelSender,
    totalWordCount,
    balance,
  };

  const account = useAccount();

  try {
    addressSchema.parse(address);
  } catch (err) {
    return (
      <div className="p-2 gap-2 bg-red-200 rounded-lg shadow-sm border-red-300 border text-red-700 space-y-4 ">
        Invalid address
      </div>
    );
  }

  if (!ethWordData.channelRecipient) {
    return (
      <div className="p-2 w-full gap-2 bg-gray-200 rounded-lg shadow-sm border-gray-300 border text-gray-700 space-y-4 ">
        Loading...
        <p className="text-xs max-w-xs">
          check if this smart contract address exists
        </p>
      </div>
    );
  }

  if (channelRecipient !== account?.address) {
    return (
      <div className=" w-full gap-2 bg-white ">
        <p className="p-2 text-red-700  break-words w-full bg-red-200 border rounded-lg border-red-300 ">
          You are not the recipient of this contract. Please, connect with the
          address {channelRecipient}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto bg-white space-y-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900">Contract Info</h2>
      {channelRecipient !== account?.address ? (
        <>
          <p className="text-red-700 break-words max-w-md">
            You are not the recipient of this contract. Please, connect with the
            address {channelRecipient}
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-700">
            <span className="font-semibold">Channel recipient:</span>{" "}
            {channelRecipient}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Channel tip:</span> {channelTip}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Channel sender:</span>{" "}
            {channelSender}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total word count:</span>{" "}
            {totalWordCount?.toString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Balance:</span>{" "}
            {formatEther(balance?.value || 0n)}
          </p>
          <CloseChannel address={address} />
        </>
      )}
    </div>
  );
};

export default ContractInfo;
