import React, { useEffect, useState } from "react";
import { vendorApi, channelApi } from "../../clients/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Clock, Hash, Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { z } from "zod";
import { ChannelDataSchema, VendorDataSchema } from "@/clients/schemas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";

type Vendor = z.infer<typeof VendorDataSchema>;
type Channel = z.infer<typeof ChannelDataSchema>;

// Hardcoded vendor ID as mentioned
const VENDOR_ID = import.meta.env.VITE_VENDOR_ID as string;

const formatErrorMessage = (error: unknown): string => {
  if (error instanceof z.ZodError) {
    return error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (Array.isArray(error)) {
    return JSON.stringify(error);
  }
  return "An unknown error occurred";
};

// Channel Close Dialog Component
interface CloseChannelDialogProps {
  channel: Channel;
  onSuccess: () => void;
}

const CloseChannelDialog: React.FC<CloseChannelDialogProps> = ({
  channel,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isClosing, setIsClosing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleCloseChannel = async () => {
    try {
      setIsClosing(true);

      const response = await channelApi.closeChannel(channel.id);

      // Check if the response indicates an error
      if ("success" in response && !response.success) {
        throw new Error(response.message);
      }

      // Handle successful response
      if ("data" in response) {
        setTxHash(response.data.settlementTx || null);
        onSuccess();

        toast({
          title: "Success",
          description: "Channel closed successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to close channel",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={channel.status === "CLOSED"}
        >
          Close Channel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Payment Channel</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close this channel? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Contract Address
              </div>
              <div className="font-mono text-sm break-all">
                {channel.contractAddress}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Total Amount
              </div>
              <div className="font-mono text-sm">{channel.totalAmount} ETH</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Last Index
              </div>
              <div className="font-mono text-sm">{channel.lastIndex}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Number of Hashes
              </div>
              <div className="font-mono text-sm">{channel.numHashes}</div>
            </div>
          </div>

          {txHash && (
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-sm space-y-1">
                <p>Channel closed successfully!</p>
                <p className="font-mono text-xs truncate">TX Hash: {txHash}</p>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClosing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCloseChannel}
            disabled={isClosing || channel.status === "CLOSED"}
          >
            {isClosing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              "Close Channel"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface DeleteChannelDialogProps {
  channel: Channel;
  onSuccess: () => void;
}

const DeleteChannelDialog: React.FC<DeleteChannelDialogProps> = ({
  channel,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteChannel = async () => {
    try {
      setIsDeleting(true);
      const response = await channelApi.deleteChannel(channel.id);

      if ("success" in response && !response.success) {
        throw new Error(response.message || "Failed to delete channel");
      }

      onSuccess();
      toast({
        title: "Success",
        description: "Channel deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete channel",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Channel</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this channel? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Contract Address
              </div>
              <div className="font-mono text-sm break-all">
                {channel.contractAddress}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Total Amount
              </div>
              <div className="font-mono text-sm">{channel.totalAmount} ETH</div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteChannel}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Channel"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Channel Card Component
interface ChannelCardProps {
  channel: Channel;
  onChannelClose: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onChannelClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">
              Channel {channel.id.slice(0, 8)}...
            </CardTitle>
            <Badge
              variant={channel.status === "OPEN" ? "default" : "secondary"}
            >
              {channel.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <CloseChannelDialog channel={channel} onSuccess={onChannelClose} />
            <DeleteChannelDialog channel={channel} onSuccess={onChannelClose} />
          </div>
        </div>
        {channel.status === "CLOSED" && (
          <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
            {channel.closedAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Closed on {formatDate(channel.closedAt)}</span>
              </div>
            )}
            {channel.settlementTx && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                <span className="font-mono">
                  TX: {channel.settlementTx.slice(0, 10)}...
                  {channel.settlementTx.slice(-8)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Contract Address
            </div>
            <div className="font-mono text-sm break-all">
              {channel.contractAddress}
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Total Amount
            </div>
            <div className="font-mono text-sm">{channel.totalAmount} ETH</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Number of Hashes
            </div>
            <div className="font-mono text-sm">{channel.numHashes}</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Last Index</div>
            <div className="font-mono text-sm">{channel.lastIndex}</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Last Hash</div>
            <div className="font-mono text-sm break-all">
              {channel.tail}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Vendor Info Component
interface VendorInfoProps {
  vendor: Vendor;
}

const VendorInfo: React.FC<VendorInfoProps> = ({ vendor }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Vendor Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Chain ID</div>
          <div className="font-mono text-sm">{vendor.chainId}</div>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Vendor Address
          </div>
          <div className="font-mono text-sm break-all">{vendor.address}</div>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Amount per Hash
          </div>
          <div className="font-mono text-sm">{vendor.amountPerHash} ETH</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main AdminPanel Component
export const AdminPanel: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const vendorResponse = await vendorApi.getVendor(VENDOR_ID);

      if ("success" in vendorResponse && !vendorResponse.success) {
        throw new Error(
          vendorResponse.message || "Failed to fetch vendor data"
        );
      }

      setVendor(vendorResponse.data);

      const channelsResponse = await channelApi.listChannelsByVendor(VENDOR_ID);

      if ("success" in channelsResponse && !channelsResponse.success) {
        throw new Error(channelsResponse.message || "Failed to fetch channels");
      }

      setChannels(channelsResponse.data);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Detailed error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription className="whitespace-pre-wrap font-mono text-sm">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {vendor && <VendorInfo vendor={vendor} />}

      <Card>
        <CardHeader>
          <CardTitle>Channel Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {channels.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No channels found for this vendor
            </div>
          ) : (
            channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onChannelClose={fetchData}
              />
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default AdminPanel;
