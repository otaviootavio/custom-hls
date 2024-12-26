import { HashStreamingProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export const HashStreaming: React.FC<HashStreamingProps> = ({
  paymentMode,
  lastHashIndex,
  channelData,
  onPaymentModeChange,
  onRequestHash,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Stream Hashes</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>Payment Mode</Label>
          <div className="flex flex-wrap gap-2">
            {["pop", "full", "secret"].map((mode) => (
              <Button
                key={mode}
                variant={paymentMode === mode ? "default" : "outline"}
                onClick={() => onPaymentModeChange(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Last Hash Index: {lastHashIndex}</Label>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onRequestHash}>Request Hash</Button>
            <Button variant="outline">Force Sync</Button>
          </div>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(
              {
                mode: paymentMode,
                lastHashIndex,
                channelData,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </CardContent>
  </Card>
);
