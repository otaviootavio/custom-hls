import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "../ui/slider";
import { channelApi } from "@/clients/api";

export const OpenChannel = () => {
  const { toast } = useToast();

  // Local state
  const [numHashes, setNumHashes] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContract, setDeployedContract] = useState("");

  // Using context
  const { selectedHashchain, error, updateContractDetails } = useHashchain();

  const handleNumHashesChange = (values: number[]) => {
    setNumHashes(values[0].toString());
  };

  const handleDeployContract = async () => {
    if (!selectedHashchain?.data?.vendorData || !numHashes) {
      toast({
        title: "Error",
        description: "Missing required data",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);

    try {
      // First step: Deploy contract (this would be replaced with actual contract deployment)
      const contractAddress = await deploySmartContract();
      setDeployedContract(contractAddress);

      // Calculate total amount
      const amountPerHash = selectedHashchain.data.vendorData.amountPerHash;
      const totalAmount = parseFloat(numHashes) * parseFloat(amountPerHash);

      // Create channel in the backend
      const response = await channelApi.createChannel({
        contractAddress: contractAddress as `0x${string}`,
        numHashes: parseInt(numHashes),
        lastIndex: 0,
        lastHash:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        totalAmount,
        vendorId: import.meta.env.VITE_VENDOR_ID as string,
      });

      // Update local state with new channel data
      if (response.success) {
        await updateContractDetails({
          contractAddress: response.data.contractAddress,
          numHashes: response.data.numHashes.toString(),
          totalAmount: response.data.totalAmount.toString(),
        });

        toast({
          title: "Success",
          description: "Channel opened successfully",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to open channel";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error opening channel:", err);
      setDeployedContract("");
    } finally {
      setIsDeploying(false);
    }
  };

  // Mock function to simulate contract deployment
  // This would be replaced with actual contract deployment logic
  const deploySmartContract = async (): Promise<string> => {
    // Simulate contract deployment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a valid contract address
    const address = `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    return address;
  };

  const amountPerHash = selectedHashchain?.data.vendorData.amountPerHash ?? "0";

  const totalAmount =
    selectedHashchain?.data?.vendorData && numHashes
      ? (parseFloat(numHashes) * parseFloat(amountPerHash)).toFixed(6)
      : "0";

  const isDisabled =
    !selectedHashchain?.data?.vendorData?.chainId ||
    isDeploying ||
    !!selectedHashchain.data.contractAddress;

  return (
    <Card className={isDisabled ? "opacity-25" : ""}>
      <CardHeader>
        <CardTitle>
          <p className="font-bold text-md">2. Open the channel!</p>
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
                value={[parseInt(numHashes) || 0]}
                onValueChange={handleNumHashesChange}
                disabled={isDisabled}
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
                  <Button onClick={handleDeployContract} disabled={isDisabled}>
                    {isDeploying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Opening Channel...
                      </>
                    ) : (
                      "Open Channel"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm">
              You will be able to watch up to{" "}
              <span className="font-bold">
                {(parseFloat(numHashes) / 4 || 0).toFixed(0)} minutes
              </span>
            </p>
          </div>
        </div>

        {/* Error and Success Messages */}
        <div className="mt-4">
          {error && (
            <div className="text-sm text-red-500 mb-4">
              Error: {error.message}
            </div>
          )}

          {deployedContract && (
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-sm space-y-1 w-full">
                <p className="font-bold">Channel opened successfully!</p>
                <p className="font-mono text-xs truncate">
                  Contract Address: {deployedContract}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenChannel;
