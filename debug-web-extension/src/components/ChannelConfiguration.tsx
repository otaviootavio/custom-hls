import { ChannelConfigProps } from "@/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const ChannelConfiguration: React.FC<ChannelConfigProps> = ({
    channelData,
    vendorInfoFetched,
    onHashCountChange
  }) => (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-medium">2. Configure Channel</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numHashes">Number of Hashes</Label>
          <Input
            id="numHashes"
            name="numHashes"
            value={channelData.numHashes}
            onChange={onHashCountChange}
            placeholder="Enter number of hashes"
            type="number"
            min="1"
            disabled={!vendorInfoFetched}
          />
        </div>
        <div className="space-y-2">
          <Label>Total Amount (ETH)</Label>
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded border">
            {channelData.totalAmount} ETH
          </div>
        </div>
      </div>
    </div>
  );
  