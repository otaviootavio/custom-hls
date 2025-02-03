import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink } from "lucide-react";
import { useHashchain } from "@/context/HashchainProvider";

const generateMockAddress = () => {
  const hexChars = "0123456789abcdefABCDEF";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  return address;
};

const generateMockHash = () => {
  return (
    "0x" +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
  );
};

const generateMockChannelData = () => {
  const chainId = "0x" + Math.floor(Math.random() * 100).toString(16);
  
  return {
    chainId: chainId,
    contractAddress: generateMockAddress(),
    vendorData: {
      vendorAddress: generateMockAddress(),
      chainId: chainId,
      amountPerHash: (Math.random() * 0.1).toFixed(4),
    },
    hash: generateMockHash(),
    lastIndex: Math.floor(Math.random() * 100),
    numHashes: Math.floor(Math.random() * 1000).toString(),
    totalAmount: (Math.random() * 10).toFixed(4),
  };
};

export const AdminPanel = () => {
  const { toast } = useToast();
  const { importHashchain } = useHashchain();
  const [isExporting, setIsExporting] = React.useState(false);

  // Memoized data generation - only created once per component mount
  const channelData = React.useMemo(() => generateMockChannelData(), []);

  const handleExportToStorage = async () => {
    try {
      setIsExporting(true);
      await importHashchain({
        chainId: channelData.chainId.toString(),
        contractAddress: channelData.contractAddress,
        vendorData: channelData.vendorData,
        hash: channelData.hash,
        lastIndex: channelData.lastIndex,
        numHashes: channelData.numHashes,
        totalAmount: channelData.totalAmount,
      });
      toast({
        title: "Success",
        description: "Hash exported to storage successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to export hash",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Administrator Panel</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Network Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Network Configuration</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Chain ID</div>
              <div className="font-mono text-sm">{channelData.chainId}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Vendor Address
              </div>
              <div className="font-mono text-sm break-all">
                {channelData.vendorData.vendorAddress}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Amount/Hash
              </div>
              <div className="font-mono text-sm">
                {channelData.vendorData.amountPerHash} ETH
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Total Hashes
              </div>
              <div className="font-mono text-sm">{channelData.numHashes}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Total Amount
              </div>
              <div className="font-mono text-sm">
                {channelData.totalAmount} ETH
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Smart Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Contract Address
              </div>
              <div className="font-mono text-sm break-all">
                {channelData.contractAddress}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Last Hash Index
                </div>
                <div className="font-mono text-sm">{channelData.lastIndex}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Commitment Hash
                </div>
                <div className="font-mono text-sm break-all">
                  {channelData.hash}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Section */}
        <div className="pt-4">
          <Button
            className="w-full"
            onClick={handleExportToStorage}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Hash...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Import Hash to Storage
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
