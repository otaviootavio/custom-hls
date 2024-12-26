import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMockedChainExtension } from '@/context/MockChainExtensionProvider';
import { useToast } from '@/hooks/use-toast';

interface VendorData {
  chainId: string;
  vendorAddress: string;
  amountPerHash: string;
}

export const VendorMockSetup: React.FC = () => {
  const { storeVendorData } = useMockedChainExtension();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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
      setIsSubmitting(true);
      await storeVendorData(vendorData);
      toast({
        title: "Success",
        description: "Vendor data has been stored successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to store vendor data",
        variant: "destructive",
      });
      console.error('Error storing vendor data:', error);
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleSetDefault} 
            variant="outline"
            disabled={isSubmitting}
          >
            Set Default Values
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Vendor Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};