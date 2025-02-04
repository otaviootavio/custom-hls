import { useState } from "react";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  const { loading, getSelectedHashchain, getAllHashes } = useHashchain();
  const [isClosing, setIsClosing] = useState(false);
  const [hashValue, setHashValue] = useState("");
  const [hashIndex, setHashIndex] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [txHash] = useState(generateMockHash());
  const [numberOfHashes, setNumberOfHashes] = useState("");

  const handleFetchFromStorage = async () => {
    try {
      const hashchainData = await getSelectedHashchain();
      if (!hashchainData?.hashchainId)
        throw new Error("No hashchain found in storage");

      const currentIndex = hashchainData.data.lastIndex;
      const fullHashchain = await getAllHashes();

      setHashValue(fullHashchain[0]);
      setHashIndex(currentIndex.toString());
      setContractAddress(hashchainData.data.contractAddress ?? "");
      setTotalAmount(hashchainData.data.totalAmount ?? "");
      setNumberOfHashes(hashchainData.data.numHashes ?? "");

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
            <CardTitle>
              <div className="flex flex-row justify-between items-center">
                <p className="text-lg">1. Hash Information</p>
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
                      Import from wallet
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col">
            <div className="flex flex-wrap justify-start items-center gap-2">
              <div className="p-4 bg-muted rounded-lg max-w-full">
                <div className="text-sm text-muted-foreground mb-1">
                  Raw Hash
                </div>
                <div className="font-mono text-sm truncate w-full">
                  {hashValue}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Hash Index
                </div>
                <div className="flex-fill text-truncate font-mono text-sm">
                  {hashIndex}
                </div>
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
            <div className="flex flex-wrap justify-start items-center gap-2">
              <div className="p-4 bg-muted rounded-lg max-w-full">
                <div className="text-sm text-muted-foreground mb-1">
                  Contract Address
                </div>
                <div className="font-mono text-sm truncate w-full">
                  {contractAddress}
                </div>
              </div>
              <div className=" p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Number of hashes
                </div>
                <div className="font-mono text-sm">{numberOfHashes}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Total amount
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
            <div className="flex justify-between w-full gap-4 items-center">
              <div className="flex flex-row gap-2">
                <div className="p-4 bg-muted rounded-lg ">
                  <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground mb-1">
                    Amount payed to vendor
                  </div>
                  <div className="font-mono text-sm">
                    {(parseFloat(hashIndex) / parseFloat(numberOfHashes)) *
                      parseFloat(totalAmount)}{" "}
                    ETH
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1 flex flex-row items-center gap-2">
                    Amount to returned to user
                  </div>
                  <div className="font-mono text-sm">
                    {parseFloat(totalAmount) -
                      (parseFloat(hashIndex) / parseFloat(numberOfHashes)) *
                        parseFloat(totalAmount)}{" "}
                    ETH
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCloseChannel}
                disabled={isClosing || !hashValue || !hashIndex}
              >
                {isClosing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Closing Channel...
                  </>
                ) : (
                  "Close Channel"
                )}
              </Button>
            </div>

            {transactionComplete && (
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-sm space-y-1 truncate w-full ">
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
