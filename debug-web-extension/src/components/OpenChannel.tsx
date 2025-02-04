import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "./ui/slider";

const generateMockAddress = () => {
  const hexChars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += hexChars[Math.floor(Math.random() * 16)];
    // Add occasional uppercase letters to mimic checksum addresses
    if (Math.random() < 0.3)
      address = address.slice(0, -1) + address.slice(-1).toUpperCase();
  }
  return address;
};

export const OpenChannel = () => {
  const { toast } = useToast();

  // Local state
  const [numHashes, setNumHashes] = useState("");
  const [localContractAddress, setLocalContractAddress] = useState("");

  // Using new context
  const { selectedHashchain, loading, error, updateContractDetails } =
    useHashchain();

  const handleNumHashesChange = (values: number[]) => {
    setNumHashes(values[0].toString());
  };

  const handleDeployContract = async () => {
    if (!selectedHashchain || !numHashes) return;

    // if (!!selectedHashchain?.data.totalAmount) {
    //   toast({
    //     title: "Error",
    //     description: "Channel already opened",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    try {
      // Mock contract deployment
      const contractAddress = generateMockAddress();
      setLocalContractAddress(contractAddress);

      // Calculate total amount
      const totalAmount = (
        parseFloat(numHashes) *
        parseFloat(selectedHashchain.data.vendorData.amountPerHash)
      ).toString();

      // Update contract details
      await updateContractDetails({
        contractAddress,
        numHashes,
        totalAmount,
      });

      toast({
        title: "Success",
        description: "Contract deployed and channel opened successfully",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to deploy contract";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error deploying contract:", err);
      setLocalContractAddress("");
    }
  };

  const totalAmount =
    selectedHashchain && numHashes
      ? (
          parseFloat(numHashes) *
          parseFloat(selectedHashchain.data.vendorData.amountPerHash)
        ).toFixed(6)
      : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="font-bold text-xl">Open the channel!</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Configure Channel Section */}
        <div>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="numHashes" className="text-sm text-gray-500">
                Number of Hashes: {numHashes}
              </Label>
              <Slider
                id="numHashes"
                min={100}
                max={1000}
                step={100}
                value={[parseInt(numHashes)]}
                onValueChange={handleNumHashesChange}
                disabled={!selectedHashchain?.data.vendorData.chainId}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-500">
                Total Amount (ETH)
              </Label>
              <div className="flex flex-row items-center gap-2">
                <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
                  {totalAmount} ETH
                </div>

                <div>
                  <Button
                    onClick={handleDeployContract}
                    disabled={!selectedHashchain?.data.vendorData.chainId}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      "Deploy Smart Contract"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm">
              You will be able to watch up to{" "}
              <span className=" font-bold">
                {parseFloat(numHashes) / 4 || 0} minutes.
              </span>
            </p>
          </div>
        </div>
        {/* Deploy Contract Section */}
        <div className="self-place-end">
          {error && (
            <div className="text-sm text-red-500 mt-4">
              Error: {error.message}
            </div>
          )}

          {localContractAddress && (
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-sm space-y-1 w-full">
                <p className="font-bold">Contract deployed successfully!</p>
                <p className="font-mono text-xs truncate">
                  Address: {localContractAddress}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
