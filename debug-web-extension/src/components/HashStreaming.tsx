import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "./VideoStreaming";
import { useHashchain } from "@/context/HashchainProvider";
import { RequestSecretConnection } from "./RequestSecretConnection";
import { ChannelNotOpened } from "./ChannelNotOpened";

export const HashStreaming: React.FC = () => {
  const { authStatus, selectedHashchain } = useHashchain();
  console.log(authStatus, selectedHashchain);
  const isChannelOpened = !!selectedHashchain?.data.contractAddress;
  const isSecretAuth = authStatus?.secretAuth;
  console.log(isChannelOpened, isSecretAuth);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stream Hashes</CardTitle>
      </CardHeader>
      <CardContent>
        {isSecretAuth && isChannelOpened ? <VideoPlayer /> : null}
        {!isSecretAuth ? <RequestSecretConnection /> : null}
        {isChannelOpened && !isSecretAuth ? <ChannelNotOpened /> : null}
      </CardContent>
    </Card>
  );
};

export default HashStreaming;
