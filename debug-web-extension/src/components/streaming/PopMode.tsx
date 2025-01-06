import { useHashchain } from "@/context/HashchainProvider";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Hash, Loader2, RefreshCw } from "lucide-react";

export const PopMode = () => {
    const { toast } = useToast();
    const { 
      selectedHashchain, 
      loading,
      error,
      getNextHash,
      syncIndex 
    } = useHashchain();
  
    const handleRequestHash = async () => {
      try {
        const hash = await getNextHash();
        if (!hash) {
          toast({
            title: "No more hashes",
            description: "All hashes have been consumed",
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Hash Retrieved",
          description: (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
              {hash}
            </div>
          ),
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve hash';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };
  
    const handleSync = async () => {
      try {
        await syncIndex(selectedHashchain?.data.lastIndex || 0);
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
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium mb-2">Pop Mode Info</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hashes are retrieved one at a time and tracked by the extension. 
            Sync button updates to current state.
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Current Hash Index</Label>
            <div className="text-2xl font-mono">
              {selectedHashchain?.data.lastIndex || 0}
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-500">
              {error.message}
            </div>
          )}
          
          <div className="space-x-2">
            <Button
              onClick={handleRequestHash}
              disabled={loading || !selectedHashchain?.data.contractAddress}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Hash className="mr-2 h-4 w-4" />
                  Get Next Hash
                </>
              )}
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