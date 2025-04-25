import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VendorDataSchema } from '../../clients/schemas';
import { z } from 'zod';

interface VendorInfoCardProps {
  vendor: z.infer<typeof VendorDataSchema>;
}

const VendorInfoCard: React.FC<VendorInfoCardProps> = ({ vendor }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Information</CardTitle>
        <CardDescription>
          Details for the connected vendor wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Vendor ID:</strong> {vendor.id}
        </p>
        <p>
          <strong>Address:</strong> {vendor.address}
        </p>
        <p>
          <strong>Chain ID:</strong> {vendor.chainId}
        </p>
        <p>
          <strong>Amount per Hash:</strong> {vendor.amountPerHash} ETH
        </p>{" "}
        {/* Assuming ETH, adjust if needed */}
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(vendor.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default VendorInfoCard; 