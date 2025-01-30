import { useHashchain } from "@/context/HashchainProvider";
import { Button } from "./ui/button";

export const ConnectMiniMoniWallet = () => {
  const { requestConnection } = useHashchain();
  const handleOnClick = async () => {
    requestConnection();
  };

  return (
    <Button
      onClick={() => {
        handleOnClick();
      }}
      variant="default"
      className="font-bold"
      size="sm"
    >
      Connect MiniMoni Wallet
    </Button>
  );
};
