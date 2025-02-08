import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { vendorApi } from "@/clients/api";

// Update the interface to match the schema
interface VendorData {
  amountPerHash: number;
  chainId: number;
  vendorAddress: string;
}

export const VendorRealData: React.FC = () => {
  const { initializeHashchain, loading } = useHashchain();
  const { toast } = useToast();
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setIsLoading(true);

        const response = await vendorApi.getVendor(
          import.meta.env.VITE_VENDOR_ID as string
        );

        if (!response.success) {
          throw new Error(response.message);
        }

        // Transform the data to match the expected interface
        setVendorData({
          amountPerHash: response.data.amountPerHash,
          chainId: response.data.chainId,
          vendorAddress: response.data.address,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch vendor data. Please try again later.",
          variant: "destructive",
        });
        console.error("Error fetching vendor data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [toast]);

  const handleSubmit = async () => {
    if (!vendorData) return;

    try {
      const hashchainId = await initializeHashchain({
        amountPerHash: vendorData.amountPerHash.toString(),
        chainId: vendorData.chainId.toString(),
        vendorAddress: vendorData.vendorAddress,
      });

      toast({
        title: "Success",
        description: `Hashchain initialized successfully with ID: ${hashchainId}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to initialize hashchain. Please try again.",
        variant: "destructive",
      });
      console.error("Error initializing hashchain:", err);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Vendor Data</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading vendor data...</span>
        </CardContent>
      </Card>
    );
  }

  if (!vendorData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Vendor Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No vendor data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>1. Pre-open the channel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Chain ID</h3>
          <p className="text-sm text-muted-foreground">{vendorData.chainId}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Vendor Address</h3>
          <p className="text-sm text-muted-foreground break-all">
            {vendorData.vendorAddress}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Amount per Hash (ETH)</h3>
          <p className="text-sm text-muted-foreground">
            {vendorData.amountPerHash}
          </p>
        </div>

        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            "Import"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
