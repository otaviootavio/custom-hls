import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink } from "lucide-react";
import { useHashchain } from '@/context/HashchainProvider';

export const AdminPanel = () => {
  const { toast } = useToast();
  const { importHashchain } = useHashchain();
  const [isExporting, setIsExporting] = React.useState(false);

  // Channel data
  const channelData = {
    chainId: "0x5",
    contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    vendorData: {
      vendorAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      chainId: "0x5",
      amountPerHash: "0.015"
    },
    hash: "0x123...", // This would be the actual hash to import
    lastIndex: 42,
    numHashes: "100",
    totalAmount: "1.5"
  };

  const handleExportToStorage = async () => {
    try {
      setIsExporting(true);
      
      // Import hashchain data to storage
      await importHashchain({
        chainId: channelData.chainId,
        contractAddress: channelData.contractAddress,
        vendorData: channelData.vendorData,
        hash: channelData.hash,
        lastIndex: channelData.lastIndex,
        numHashes: channelData.numHashes,
        totalAmount: channelData.totalAmount
      });
      
      toast({
        title: "Success",
        description: "Hash exported to storage successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to export hash to storage",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Administrator Panel</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chain ID and Vendor Info */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Chain ID</div>
            <div className="font-mono text-sm">
              {channelData.chainId}
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Vendor</div>
            <div className="font-mono text-sm break-all">
              {channelData.vendorData.vendorAddress}
            </div>
          </div>
        </div>

        {/* Amount/Hash */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Amount/Hash</div>
          <div className="font-mono text-sm">
            {channelData.vendorData.amountPerHash} ETH
          </div>
        </div>

        {/* Contract Address */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Contract</div>
          <div className="font-mono text-sm break-all">
            {channelData.contractAddress}
          </div>
        </div>

        {/* Number of Hashes */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Number of Hashes</div>
          <div className="font-mono text-sm">
            {channelData.numHashes}
          </div>
        </div>

        {/* Total Amount */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Total Amount</div>
          <div className="font-mono text-sm">
            {channelData.totalAmount} ETH
          </div>
        </div>

        {/* Last Hash Index */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Last Hash Index</div>
          <div className="font-mono text-sm">
            {channelData.lastIndex}
          </div>
        </div>

        {/* Import Button */}
        <div className="pt-4 border-t">
          <Button
            className="w-full"
            onClick={handleExportToStorage}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Hash...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Import Hash to Storage
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};