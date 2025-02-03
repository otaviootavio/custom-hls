import { useState } from "react";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { AlertCircle, Loader2, Download } from "lucide-react";

const generateMockHash = () => {
  return (
    "0x" +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
  );
};

const simulateTransaction = async () => {
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 1000)
  );
};

export const CloseChannel = () => {
  const { toast } = useToast();
  const { loading, getSelectedHashchain } = useHashchain();
  const [isClosing, setIsClosing] = useState(false);
  const [hashValue, setHashValue] = useState("");
  const [hashIndex, setHashIndex] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [txHash] = useState(generateMockHash());

  const handleFetchFromStorage = async () => {
    try {
      const hashchainData = await getSelectedHashchain();
      if (!hashchainData) throw new Error("No hashchain found in storage");

      const allHashes = hashchainData.data.hashes;
      const currentIndex = hashchainData.data.lastIndex;

      if (!allHashes?.length)
        throw new Error("No hashes found in the hashchain");

      setHashValue(allHashes[0] || generateMockHash());
      setHashIndex(currentIndex.toString());
      setContractAddress(hashchainData.data.contractAddress ?? "");
      setTotalAmount(hashchainData.data.totalAmount ?? "");

      toast({
        title: "Success",
        description: "Hash fetched from storage successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to fetch hash",
        variant: "destructive",
      });
    }
  };

  const handleCloseChannel = async () => {
    if (!hashValue || !hashIndex) {
      toast({
        title: "Error",
        description: "Please provide both hash and index",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsClosing(true);
      await simulateTransaction();
      setTransactionComplete(true);
      toast({ title: "Success", description: "Channel closed successfully" });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to close channel",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Close Payment Channel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hash Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Hash Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Label>Fetch from Storage</Label>
                <p className="text-sm text-muted-foreground">
                  Retrieve latest hash from persistent storage
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleFetchFromStorage}
                disabled={loading || isClosing}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Fetch Hashes
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Contract Address
                </div>
                <div className="font-mono text-sm truncate">{hashValue}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Total Amount
                </div>
                <div className="font-mono text-sm">{hashIndex} ETH</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Details - Now using actual context data */}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Channel Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Contract Address
                </div>
                <div className="font-mono text-sm truncate">
                  {contractAddress}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Total Amount
                </div>
                <div className="font-mono text-sm">{totalAmount} ETH</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Channel Closure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={handleCloseChannel}
              disabled={isClosing || !hashValue || !hashIndex}
            >
              {isClosing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Closing Channel...
                </>
              ) : (
                "Confirm Channel Closure"
              )}
            </Button>

            {transactionComplete && (
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-sm space-y-1">
                  <p>Channel closed successfully!</p>
                  <p className="font-mono text-xs truncate">
                    TX Hash: {txHash}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
