import { useMockedChainExtension } from "@/context/MockChainExtensionProvider";
import { Card, CardContent } from "./ui/card";
import { AlertCircle } from "lucide-react";

export const SelectedHashchainDisplay = () => {
  const { selectedHashchain, lastHashIndex } = useMockedChainExtension();

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

  return (
    <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Chain ID
            </p>
            <p className="text-sm font-mono">{selectedHashchain.chainId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Vendor
            </p>
            <p
              className="text-sm font-mono truncate"
              title={selectedHashchain.vendorAddress}
            >
              {selectedHashchain.vendorAddress}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Amount/Hash
            </p>
            <p className="text-sm font-mono">
              {selectedHashchain.amountPerHash} ETH
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Contract
            </p>
            <p
              className="text-sm font-mono truncate"
              title={selectedHashchain.contractAddress}
            >
              {selectedHashchain.contractAddress || "Not deployed"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Number of Hashes
            </p>
            <p className="text-sm font-mono">
              {selectedHashchain.numHashes || "0"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Amount
            </p>
            <p className="text-sm font-mono">
              {selectedHashchain.totalAmount} ETH
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Last Hash Index
            </p>
            <p className="text-sm font-mono">{lastHashIndex}</p>
          </div>
          {selectedHashchain.secret && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Secret
              </p>
              <p
                className="text-sm font-mono truncate"
                title={selectedHashchain.secret}
              >
                {selectedHashchain.secret}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};