import { useHashchain } from "@/context/HashchainProvider";
import { Card, CardContent } from "./ui/card";
import { AlertCircle } from "lucide-react";

export const SelectedHashchainDisplay = () => {
  const { selectedHashchain, error } = useHashchain();

  if (!selectedHashchain) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex items-center text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>No hashchain selected</span>
        </div>
      </div>
    );
  }

  const {
    vendorData: { chainId, vendorAddress, amountPerHash },
    contractAddress,
    numHashes,
    totalAmount,
    lastIndex,
  } = selectedHashchain.data;

  return (
    <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-4">
        {error && (
          <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400 text-sm">
            {error.message}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Chain ID
            </p>
            <p className="text-sm font-mono">{chainId}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Vendor
            </p>
            <p
              className="text-sm font-mono truncate"
              title={vendorAddress}
            >
              {vendorAddress}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Amount/Hash
            </p>
            <p className="text-sm font-mono">
              {amountPerHash} ETH
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Contract
            </p>
            <p
              className="text-sm font-mono truncate"
              title={contractAddress}
            >
              {contractAddress || "Not deployed"}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Number of Hashes
            </p>
            <p className="text-sm font-mono">
              {numHashes || "0"}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Amount
            </p>
            <p className="text-sm font-mono">
              {totalAmount || "0"} ETH
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Last Hash Index
            </p>
            <p className="text-sm font-mono">{lastIndex}</p>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};