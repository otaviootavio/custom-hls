import { useHashchain } from "@/context/HashchainProvider";
import { Button } from "@/components/ui/button";

export const ConnectMiniMoniWallet = () => {
  const { requestConnection, authStatus } = useHashchain();
  if (authStatus?.secretAuth) {
    return (
      <Button
        variant="default"
        size="sm"
        disabled
      >
        Streaming
      </Button>
    );
  }

  if (authStatus?.basicAuth) {
    return (
      <Button variant="default" className="font-bold" size="sm" disabled>
        Connected
      </Button>
    );
  }

  return (
    <Button
      onClick={() => requestConnection()}
      variant="default"
      className="font-bold"
      size="sm"
    >
      Connect MiniMoni Wallet
    </Button>
  );
};
