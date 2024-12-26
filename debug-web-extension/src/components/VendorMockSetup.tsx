import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface VendorMockSetupProps {
  onSetVendorData: (data: {
    chainId: string;
    vendorAddress: string;
    amountPerHash: string;
  }) => void;
}

export const VendorMockSetup: React.FC<VendorMockSetupProps> = ({
  onSetVendorData,
}) => {
  const [vendorData, setVendorData] = React.useState({
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

  const handleSubmit = () => {
    onSetVendorData(vendorData);
  };

  const handleSetDefault = () => {
    const defaultData = {
      chainId: '0x5',
      vendorAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      amountPerHash: '0.001'
    };
    setVendorData(defaultData);
  };

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
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSetDefault} variant="outline">
            Set Default Values
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!vendorData.chainId || !vendorData.vendorAddress || !vendorData.amountPerHash}
          >
            Save Vendor Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};