import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useHashchain } from '@/context/HashchainProvider';
import { useToast } from '@/hooks/use-toast';

const generateMockAddress = () => {
  const hexChars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += hexChars[Math.floor(Math.random() * 16)];
    // Add occasional uppercase letters to mimic checksum addresses
    if (Math.random() < 0.3) address = address.slice(0, -1) + address.slice(-1).toUpperCase();
  }
  return address;
};


export const OpenChannel = () => {
  const { toast } = useToast();
  
  // Local state
  const [numHashes, setNumHashes] = useState('');
  const [dataFetched, setDataFetched] = useState(false);
  const [localContractAddress, setLocalContractAddress] = useState('');

  // Using new context
  const { 
    selectedHashchain,
    loading,
    error,
    updateContractDetails
  } = useHashchain();

  const handleFetchFromExtension = async () => {
    if (selectedHashchain) {
      setDataFetched(true);
      toast({
        title: "Success",
        description: "Vendor data fetched successfully"
      });
    } else {
      toast({
        title: "Error",
        description: "No vendor data found. Please set up vendor data first.",
        variant: "destructive"
      });
    }
  };

  const handleNumHashesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseInt(value) >= 0 || value === '') {
      setNumHashes(value);
    }
  };

  const handleDeployContract = async () => {
    if (!selectedHashchain || !numHashes) return;

    try {
      // Mock contract deployment
      const contractAddress = generateMockAddress();
      setLocalContractAddress(contractAddress);
      
      // Calculate total amount
      const totalAmount = (
        parseFloat(numHashes) * 
        parseFloat(selectedHashchain.data.vendorData.amountPerHash)
      ).toString();
      
      // Update contract details
      await updateContractDetails({
        contractAddress,
        numHashes,
        totalAmount
      });

      toast({
        title: "Success",
        description: "Contract deployed and channel opened successfully"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deploy contract';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error('Error deploying contract:', err);
      setLocalContractAddress('');
    }
  };

  const totalAmount = selectedHashchain && numHashes ? 
    (parseFloat(numHashes) * 
     parseFloat(selectedHashchain.data.vendorData.amountPerHash)
    ).toFixed(6) :
    '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Payment Channel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fetch from Extension Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">1. Fetch Vendor Information</h3>
            <Button 
              onClick={handleFetchFromExtension}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Fetch From Extension'
              )}
            </Button>
          </div>

          {selectedHashchain && dataFetched && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm mb-2">Fetched Data:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>Chain ID: {selectedHashchain.data.vendorData.chainId}</div>
                <div className="truncate">
                  Vendor: {selectedHashchain.data.vendorData.vendorAddress}
                </div>
                <div>Amount/Hash: {selectedHashchain.data.vendorData.amountPerHash} ETH</div>
              </div>
            </div>
          )}
        </div>

        {/* Configure Channel Section */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">2. Configure Channel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numHashes">Number of Hashes</Label>
              <Input
                id="numHashes"
                value={numHashes}
                onChange={handleNumHashesChange}
                type="number"
                min="1"
                placeholder="Enter number of hashes"
                disabled={!dataFetched || loading}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Amount (ETH)</Label>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded border">
                {totalAmount} ETH
              </div>
            </div>
          </div>
        </div>

        {/* Deploy Contract Section */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">3. Deploy Contract</h3>
          
          {error && (
            <div className="text-sm text-red-500">
              {error.message}
            </div>
          )}
          
          <Button 
            onClick={handleDeployContract}
            disabled={!dataFetched || !numHashes || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              'Deploy Smart Contract'
            )}
          </Button>
          
          {localContractAddress && (
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-sm space-y-1">
                <p>Contract deployed successfully!</p>
                <p className="font-mono text-xs truncate">
                  Address: {localContractAddress}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};