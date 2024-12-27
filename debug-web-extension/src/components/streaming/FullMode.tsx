import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "../ui/button";
import { Hash, List, Loader2, RefreshCw } from "lucide-react";

export const FullMode = () => {
    const { toast } = useToast();
    const [localHashes, setLocalHashes] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { 
      selectedHashchain,
      loading,
      error,
      syncIndex,
      getAllHashes 
    } = useHashchain();
  
    const handleLoadHashes = async () => {
      try {
        const hashes = await getAllHashes();
        setLocalHashes(hashes);
        setCurrentIndex(0);
        toast({
          title: "Success",
          description: `Loaded ${hashes.length} hashes`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load hashes';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };
  
    const handleGetNext = async () => {
      if (currentIndex >= localHashes.length) {
        toast({
          title: "No more hashes",
          description: "All hashes have been consumed",
          variant: "destructive"
        });
        return;
      }
  
      const hash = localHashes[currentIndex];
      setCurrentIndex(prev => prev + 1);
      
      toast({
        title: "Hash Retrieved",
        description: (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
            {hash}
          </div>
        ),
      });
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
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-medium mb-2">Full Mode Info</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All hashes are loaded and stored in browser memory. 
            Sync needed to update extension state.
          </p>
        </div>
  
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Loaded Hashes</Label>
            <div className="text-2xl font-mono">{localHashes.length}</div>
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
              onClick={handleLoadHashes}
              disabled={loading || !selectedHashchain?.data.contractAddress}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <List className="mr-2 h-4 w-4" />
                  Load All Hashes
                </>
              )}
            </Button>
            <Button
              onClick={handleGetNext}
              disabled={loading || !localHashes.length}
            >
              <Hash className="mr-2 h-4 w-4" />
              Get Next
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