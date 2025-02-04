import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { VendorData } from "@/types";

// Predefined realistic options
const CHAIN_IDS = ["1440002"];
const VENDOR_ADDRESSES = ["0x076F466f63049c5923FFe20005e92D771875C297"];
const AMOUNTS_PER_HASH = ["0.69"];

const getRandomItem = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const generateInitialData = (): VendorData => ({
  chainId: getRandomItem(CHAIN_IDS),
  vendorAddress: getRandomItem(VENDOR_ADDRESSES),
  amountPerHash: getRandomItem(AMOUNTS_PER_HASH),
});

export const VendorMockSetup: React.FC = () => {
  const { initializeHashchain, loading } = useHashchain();
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
        <CardTitle className="font-bold text-xl">Vendor Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vendor Details Section */}

        <div className="flex flex-wrap gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Chain ID</div>
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

        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Amount per Hash (ETH)
          </div>
          <div className="font-mono text-sm">{vendorData.amountPerHash}</div>
        </div>

        {/* Initialization Section */}

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            "Initialize Hashchain"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
