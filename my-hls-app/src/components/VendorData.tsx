import { env } from "@/env/client";
import SingleHashView from "./SingleHashView";
import { defaultChains, parseChainIdToChainName } from "@/lib/supportedChain";

export const VendorData = () => {
  const hashchainName = parseChainIdToChainName(
    defaultChains,
    env.NEXT_PUBLIC_VENDOR_CHAIN_ID
  );

  console.log(hashchainName);
  return (
    <div className="bg-blue-200 p-2 w-full gap-2 flex flex-col ">
      <div className=" flex flex-row justify-between items-center">
        <h2 className="text-xl ">Vendor data</h2>
      </div>
      <div className="bg-blue-300 p-2 flex flex-row justify-between">
        <div>Address</div>
        <div className="text-blue-900">
          <SingleHashView hash={env.NEXT_PUBLIC_VENDOR_ADDRESS} />
        </div>
      </div>
      <div className="bg-blue-300 p-2 flex flex-row justify-between">
        <div>Chain Id</div>
        <div className="text-blue-900">
          {hashchainName} ({env.NEXT_PUBLIC_VENDOR_CHAIN_ID})
        </div>
      </div>
    </div>
  );
};
