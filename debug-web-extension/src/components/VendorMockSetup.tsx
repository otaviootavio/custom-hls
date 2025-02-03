import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { VendorData } from "@/types";

// Predefined realistic options
const CHAIN_IDS = ["0x5", "0xaa36a7", "0x13881", "0xa4b1", "0xa869"];
const VENDOR_ADDRESSES = [
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5",
  "0x2fEb1512183545F48f6b9C5b4EbfCaF49CfCa6F3",
  "0xaf9a274c9668d68322B0dcD9043D79Cd1eBd41b3",
];
const AMOUNTS_PER_HASH = ["0.001", "0.002", "0.005", "0.0075", "0.01"];

const getRandomItem = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const generateInitialData = (): VendorData => ({
  chainId: getRandomItem(CHAIN_IDS),
  vendorAddress: getRandomItem(VENDOR_ADDRESSES),
  amountPerHash: getRandomItem(AMOUNTS_PER_HASH),
});

export const VendorMockSetup: React.FC = () => {
  const { initializeHashchain, loading, error } = useHashchain();
  const { toast } = useToast();
  const [vendorData] = React.useState<VendorData>(generateInitialData);

  const handleSubmit = async () => {
    try {
      const hashchainId = await initializeHashchain(vendorData);
      toast({
        title: "Success",
        description: `Hashchain created with ID: ${hashchainId}`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize hashchain";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error initializing hashchain:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Vendor Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vendor Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Vendor Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Chain ID
                </div>
                <div className="font-mono text-sm">{vendorData.chainId}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Vendor Address
                </div>
                <div className="font-mono text-sm truncate">
                  {vendorData.vendorAddress}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Amount per Hash (ETH)
              </div>
              <div className="font-mono text-sm">
                {vendorData.amountPerHash}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Initialization Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              3. Hashchain Initialization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                "Initialize Hashchain"
              )}
            </Button>

            {error && (
              <div className="mt-4 text-sm text-red-500">{error.message}</div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
