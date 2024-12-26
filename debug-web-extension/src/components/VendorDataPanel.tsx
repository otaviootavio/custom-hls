import { VendorDataPanelProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export const VendorDataPanel: React.FC<VendorDataPanelProps> = ({
  channelData,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Send Data to Vendor</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Channel Information</h3>
        <div className="space-y-2 text-sm">
          <p>Chain ID: {channelData.chainId || "Not set"}</p>
          <p>Vendor: {channelData.vendorAddress || "Not set"}</p>
          <p>Amount/Hash: {channelData.amountPerHash || "0"}</p>
          <p>Contract: {channelData.contractAddress || "Not deployed"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="secondary"
          disabled={!channelData.contractAddress}
          className="w-full"
          onClick={() => {
            alert(
              "Mock: Data sent to vendor successfully!\n\nValidation steps:\n1. Smart Contract exists on Chain\n2. Vendor address matches\n3. Amount per hash verified"
            );
          }}
        >
          Send to Vendor (Mock)
        </Button>
      </div>
    </CardContent>
  </Card>
);
