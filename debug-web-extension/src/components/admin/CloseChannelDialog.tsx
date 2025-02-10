import { z } from "zod";
import { ChannelDataSchema } from "../../clients/schemas";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { channelApi } from "@/clients/api";
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
import { Button } from "../ui/button";
import { formatEther } from "viem";
import { AlertCircle, Loader2 } from "lucide-react";

type Channel = z.infer<typeof ChannelDataSchema>;

interface CloseChannelDialogProps {
  channel: Channel;
  onSuccess: () => void;
}

export const CloseChannelDialog: React.FC<CloseChannelDialogProps> = ({
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
              <div className="font-mono text-sm">
                {formatEther(BigInt(channel.totalAmount))} ETH
              </div>
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
