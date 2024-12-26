import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VendorInfoProps } from '@/types';

export const VendorInfoSection: React.FC<VendorInfoProps> = ({
  channelData,
  vendorInfoFetched,
  onFetchVendorInfo
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-medium">1. Fetch Vendor Information</h3>
      <Button 
        onClick={onFetchVendorInfo}
        disabled={vendorInfoFetched}
      >
        Fetch Vendor Info
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="chainId">Chain ID</Label>
        <Input
          id="chainId"
          name="chainId"
          value={channelData.chainId}
          readOnly
          className={vendorInfoFetched ? "bg-gray-100 dark:bg-gray-800" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vendorAddress">Vendor Address</Label>
        <Input
          id="vendorAddress"
          name="vendorAddress"
          value={channelData.vendorAddress}
          readOnly
          className={vendorInfoFetched ? "bg-gray-100 dark:bg-gray-800" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amountPerHash">Amount per Hash (ETH)</Label>
        <Input
          id="amountPerHash"
          name="amountPerHash"
          value={channelData.amountPerHash}
          readOnly
          className={vendorInfoFetched ? "bg-gray-100 dark:bg-gray-800" : ""}
        />
      </div>
    </div>
  </div>
);
