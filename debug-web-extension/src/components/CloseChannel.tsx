import { useState } from "react";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, Loader2, Download } from "lucide-react";

const simulateTransaction = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
};

export const CloseChannel = () => {
  const { toast } = useToast();
  const { selectedHashchain, loading, getSelectedHashchain } = useHashchain();
  const [isClosing, setIsClosing] = useState(false);
  const [hashValue, setHashValue] = useState("");
  const [hashIndex, setHashIndex] = useState("");
  const [transactionComplete, setTransactionComplete] = useState(false);
  
  const handleFetchFromStorage = async () => {
    try {
      const hashchainData = await getSelectedHashchain();
      if (!hashchainData) {
        throw new Error("No hashchain found in storage");
      }
      
      const allHashes = hashchainData.data.hashes;
      const currentIndex = hashchainData.data.lastIndex;
      
      if (!allHashes || allHashes.length === 0) {
        throw new Error("No hashes found in the hashchain");
      }
      
      const currentHash = allHashes[0];
      if (!currentHash) {
        throw new Error("Could not find hash at current index");
      }
      
      setHashValue(currentHash);
      setHashIndex(currentIndex.toString());
      
      toast({
        title: "Success",
        description: "Hash fetched from storage successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch hash",
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
      toast({
        title: "Success",
        description: "Channel closed successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to close channel",
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">1. Provide Hash Information</h3>
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
                  Fetch From Storage
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hash">Hash Value</Label>
              <Input
                id="hash"
                value={hashValue}
                onChange={(e) => setHashValue(e.target.value)}
                placeholder="Enter hash value"
                disabled={isClosing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="index">Hash Index</Label>
              <Input
                id="index"
                type="number"
                min="0"
                value={hashIndex}
                onChange={(e) => setHashIndex(e.target.value)}
                placeholder="Enter hash index"
                disabled={isClosing}
              />
            </div>
          </div>
        </div>

        {/* Channel Closing Section */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">2. Close Channel</h3>
          
          {selectedHashchain?.data.contractAddress && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm mb-2">Current Channel:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="truncate">
                  Contract: {selectedHashchain.data.contractAddress}
                </div>
                <div>
                  Total Amount: {selectedHashchain.data.totalAmount} ETH
                </div>
              </div>
            </div>
          )}

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
              'Close Channel'
            )}
          </Button>
          
          {transactionComplete && (
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-sm">
                Channel closed successfully! Transaction has been submitted to the blockchain.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};