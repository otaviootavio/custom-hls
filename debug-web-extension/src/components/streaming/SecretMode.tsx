import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { sha256 } from "@noble/hashes/sha256";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "../ui/button";
import { Hash, Key, Loader2, RefreshCw } from "lucide-react";

export const SecretMode = () => {
    const { toast } = useToast();
    const [secret, setSecret] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const { 
      selectedHashchain,
      loading,
      error,
      syncIndex,
      getSecret
    } = useHashchain();
  
    const handleLoadSecret = async () => {
      if (!selectedHashchain) return;
      
      try {
        const loadedSecret = await getSecret();
        if (!loadedSecret) {
          throw new Error('Secret not found');
        }
        
        setSecret(loadedSecret);
        setCurrentIndex(0);
        toast({
          title: "Success",
          description: "Secret loaded successfully",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load secret';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };
  
    const handleGetNext = async () => {
      if (!secret || !selectedHashchain?.data.numHashes) return;
      
      try {
        let currentHash = secret;
        const numHashes = parseInt(selectedHashchain.data.numHashes);
        
        for (let i = 0; i < numHashes - currentIndex - 1; i++) {
          currentHash = sha256(currentHash).toString();
        }
        
        setCurrentIndex(prev => prev + 1);
        
        toast({
          title: "Hash Generated",
          description: (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
              {currentHash}
            </div>
          ),
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate hash';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };
  
    const handleSync = async () => {
      try {
        await syncIndex(currentIndex);
        toast({
          title: "Success",
          description: "Hash chain synced with current index",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sync';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };
  
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-medium mb-2">Secret Mode Info</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Uses secret to generate hashes dynamically. 
            Memory efficient but keeps secret in browser.
          </p>
        </div>
  
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Secret Status</Label>
            <div className="text-2xl font-mono">
              {secret ? "Loaded" : "Not Loaded"}
            </div>
            <div className="text-sm text-gray-500">
              Current Index: {currentIndex}
            </div>
          </div>
  
          {error && (
            <div className="text-sm text-red-500">
              {error.message}
            </div>
          )}
  
          <div className="space-x-2">
            <Button
              onClick={handleLoadSecret}
              disabled={loading || !selectedHashchain?.data.hasSecret || !selectedHashchain?.data.contractAddress}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Load Secret
                </>
              )}
            </Button>
            <Button
              onClick={handleGetNext}
              disabled={loading || !secret}
            >
              <Hash className="mr-2 h-4 w-4" />
              Generate Next
            </Button>
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync State
            </Button>
          </div>
        </div>
      </div>
    );
  };