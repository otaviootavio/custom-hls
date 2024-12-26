import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Hash, RefreshCw, Key, List } from "lucide-react";
import { useMockedChainExtension } from '@/context/MockChainExtensionProvider';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// PopMode Component
const PopMode = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { selectedHashchain, lastHashIndex, getNextHash, forceSync } = useMockedChainExtension();

  const handleRequestHash = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retrieve hash",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      await forceSync(lastHashIndex);
      toast({
        title: "Success",
        description: "Hash chain synced with current index",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          <div className="text-2xl font-mono">{lastHashIndex}</div>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleRequestHash}
            disabled={loading || !selectedHashchain?.contractAddress}
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
  const [loading, setLoading] = useState(false);
  const [localHashes, setLocalHashes] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedHashchain, forceSync, getFullHashchain } = useMockedChainExtension();

  const handleLoadHashes = async () => {
    try {
      setLoading(true);
      const hashes = await getFullHashchain();
      setLocalHashes(hashes);
      setCurrentIndex(0);
      toast({
        title: "Success",
        description: `Loaded ${hashes.length} hashes`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hashes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      setLoading(true);
      await forceSync(currentIndex);
      toast({
        title: "Success",
        description: "Hash chain synced with current index",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
        <div className="space-x-2">
          <Button
            onClick={handleLoadHashes}
            disabled={loading || !selectedHashchain?.contractAddress}
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
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedHashchain, getSecret, forceSync } = useMockedChainExtension();

  const handleLoadSecret = async () => {
    try {
      setLoading(true);
      const result = await getSecret();
      setSecret(result);
      setCurrentIndex(0);
      toast({
        title: "Success",
        description: "Secret loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load secret",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetNext = async () => {
    if (!secret) return;
    
    try {
      let currentHash = secret;
      // Convert numHashes to number and handle undefined case
    const numHashes = selectedHashchain?.numHashes ? parseInt(selectedHashchain.numHashes) : 0;
    for (let i = 0; i < numHashes - currentIndex - 1; i++) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(currentHash));
        currentHash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hash",
        variant: "destructive"
      });
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      await forceSync(currentIndex);
      toast({
        title: "Success",
        description: "Hash chain synced with current index",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
        <div className="space-x-2">
          <Button
            onClick={handleLoadSecret}
            disabled={loading || !selectedHashchain?.contractAddress}
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