import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Hash, CircleXIcon, ShieldCheck } from "lucide-react";
import { VendorMockSetup } from "./VendorMockSetup";
import { OpenChannel } from "./OpenChannel";
import { HashStreaming } from "./HashStreaming";
import { CloseChannel } from "./CloseChannel";
import { AdminPanel } from "./AdminPanel";
import ConnectMiniMoniWalletWithDropdown from "./ConnectMiniMoniWalletWithDropdown";
import { useHashchain } from "@/context/HashchainProvider";
import { ConnectOrDownloadCard } from "./ConnectOrDownloadCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const HashchainDebug = () => {
  const { authStatus } = useHashchain();
  return (
    <div>
      <div>
        <div className="mb-10 flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MiniMoni</h1>
              <p className="text-xs font-light">
                MiniMoni is a PayWord implementation that allows you to stream
                payments in real-time.
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <ConnectButton />
              {!!authStatus?.basicAuth && (
                <div className="w-min">
                  <ConnectMiniMoniWalletWithDropdown />
                </div>
              )}
            </div>
          </div>
        </div>

        <>
          {!authStatus?.basicAuth && (
            <div>
              <ConnectOrDownloadCard />
            </div>
          )}
          {!!authStatus?.basicAuth && (
            <div>
              <Tabs defaultValue="vendor">
                <TabsList className="flex flex-row">
                  <TabsTrigger
                    value="vendor"
                    className="flex items-center justify-around"
                  >
                    <div className="flex items-center">
                      <Store className="h-4 w-4 mr-2" />
                      <span>Vendor Setup</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="stream"
                    className="flex items-center justify-center"
                  >
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2" />
                      <span>Stream Hashes</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    className="flex items-center justify-center"
                  >
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>Admin</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="close"
                    className="flex items-center justify-center"
                  >
                    <div className="flex items-center">
                      <CircleXIcon className="h-4 w-4 mr-2" />
                      <span>Close Channel</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="vendor">
                  <div className="grid justify-items-stretch grid-cols-2 gap-2 mt-4">
                    <VendorMockSetup />
                    <OpenChannel />
                  </div>
                </TabsContent>
                <TabsContent value="stream">
                  <HashStreaming />
                </TabsContent>
                <TabsContent value="admin">
                  <AdminPanel />
                </TabsContent>
                <TabsContent value="close">
                  <CloseChannel />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </>
      </div>
    </div>
  );
};
