import { ChannelCloseProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export const ChannelClose: React.FC<ChannelCloseProps> = ({
  channelData,
  lastHashIndex,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Close Channel</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Channel Info</Label>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm">Chain ID: {channelData.chainId}</p>
            <p className="text-sm">
              Contract: {channelData.contractAddress || "Not deployed"}
            </p>
            <p className="text-sm">Last Hash Index: {lastHashIndex}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Actions</Label>
          <div className="flex flex-col gap-2">
            <Button>Export Data to Extension</Button>
            <Button variant="destructive">Close Channel</Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
