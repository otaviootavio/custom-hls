import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Hash, RefreshCw, Key, List } from "lucide-react";
import { useHashchain } from '@/context/HashchainProvider';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sha256 } from '@noble/hashes/sha256';

// PopMode Component
const PopMode = () => {
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

// FullMode Component
const FullMode = () => {
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

// SecretMode Component
const SecretMode = () => {
  const { toast } = useToast();
  const [secret, setSecret] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { 
    selectedHashchain,
    loading,
    error,
    syncIndex
  } = useHashchain();

  const handleLoadSecret = async () => {
    if (!selectedHashchain) return;
    
    try {
      setSecret(selectedHashchain.data.secret);
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
            disabled={loading || !selectedHashchain?.data.contractAddress}
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

// Main HashStreaming Component
export const HashStreaming: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stream Hashes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pop" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pop">Pop Mode</TabsTrigger>
            <TabsTrigger value="full">Full Mode</TabsTrigger>
            <TabsTrigger value="secret">Secret Mode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pop">
            <PopMode />
          </TabsContent>
          
          <TabsContent value="full">
            <FullMode />
          </TabsContent>
          
          <TabsContent value="secret">
            <SecretMode />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HashStreaming;