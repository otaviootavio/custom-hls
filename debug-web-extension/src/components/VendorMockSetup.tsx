import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useHashchain } from '@/context/HashchainProvider';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { VendorData } from '@/types';

export const VendorMockSetup: React.FC = () => {
  const { initializeHashchain, loading, error } = useHashchain();
  const { toast } = useToast();
  const [vendorData, setVendorData] = React.useState<VendorData>({
    chainId: '',
    vendorAddress: '',
    amountPerHash: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const hashchainId = await initializeHashchain(vendorData);
      toast({
        title: "Success",
        description: `Hashchain created with ID: ${hashchainId}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize hashchain';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error initializing hashchain:', err);
    }
  };

  const handleSetDefault = () => {
    const defaultData = {
      chainId: '0x5',
      vendorAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      amountPerHash: '0.001'
    };
    setVendorData(defaultData);
  };

  const isFormValid = vendorData.chainId && 
                     vendorData.vendorAddress && 
                     vendorData.amountPerHash;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Vendor Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chainId">Chain ID</Label>
            <Input
              id="chainId"
              name="chainId"
              value={vendorData.chainId}
              onChange={handleChange}
              placeholder="e.g., 0x5"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vendorAddress">Vendor Address</Label>
            <Input
              id="vendorAddress"
              name="vendorAddress"
              value={vendorData.vendorAddress}
              onChange={handleChange}
              placeholder="0x..."
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amountPerHash">Amount per Hash (ETH)</Label>
          <Input
            id="amountPerHash"
            name="amountPerHash"
            value={vendorData.amountPerHash}
            onChange={handleChange}
            placeholder="0.001"
            type="number"
            step="0.001"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error.message}
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={handleSetDefault} 
            variant="outline"
            disabled={loading}
          >
            Set Default Values
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
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
        </div>
      </CardContent>
    </Card>
  );
};