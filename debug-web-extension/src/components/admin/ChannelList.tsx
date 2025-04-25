import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import ChannelItem from './ChannelItem';
import { ChannelListResponse, PaymentListResponse, ErrorResponse } from '../../clients/schemas';

interface ChannelListProps {
  channelsData: ChannelListResponse | ErrorResponse | null;
  paymentsData: Record<string, PaymentListResponse | ErrorResponse | null>;
  onCloseChannelClick: (channelId: string) => void;
  onDeleteChannel: (channelId: string) => void;
  loadingPayments: Record<string, boolean>; // Track loading per channel
}

const ChannelList: React.FC<ChannelListProps> = ({ channelsData, paymentsData, onCloseChannelClick, onDeleteChannel, loadingPayments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channels</CardTitle>
        <CardDescription>
          Channels associated with this vendor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {channelsData && channelsData.success && channelsData.data.length > 0 ? (
          channelsData.data.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              payments={paymentsData[channel.id] || null}
              onCloseClick={onCloseChannelClick}
              onDelete={onDeleteChannel}
              isLoadingPayments={loadingPayments[channel.id] === undefined || loadingPayments[channel.id] === true} // Consider loading if not yet fetched or explicitly true
            />
          ))
        ) : channelsData && !channelsData.success ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Channels</AlertTitle>
            <AlertDescription>
              {channelsData.message || "Failed to load channels."}
            </AlertDescription>
          </Alert>
        ) : (
          <p>No channels found for this vendor.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChannelList; 