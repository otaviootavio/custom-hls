import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Hash, ShieldCheck } from "lucide-react";
import { OpenChannel } from "./VendorSetup/OpenChannel";
import { HashStreaming } from "./streaming/HashStreaming";
import { AdminPanel } from "./admin/AdminPanel";
import ConnectMiniMoniWalletWithDropdown from "./ConnectMiniMoniWalletWithDropdown";
import { useHashchain } from "@/context/HashchainProvider";
import { ConnectOrDownloadCard } from "./ConnectOrDownloadCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { VendorRealData } from "./VendorSetup/VendorRealData";

export const HashchainDebug = () => {
  const { authStatus } = useHashchain();
  return (
    <div>
      <div>
        <div className="mb-10 flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <div className=" flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-900">MiniMoni</h1>
              <p className="text-xs font-light">
                MiniMoni is a PayWord implementation that allows you to stream
                payments in real-time.
              </p>
              <h1 className="text-xl font-bold text-gray-900">
                We are running our beta on XRPL EVM Sidechain
              </h1>
              <p className="text-xl font-ligh">
                <a
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  href="http://bridge.xrplevm.org/"
                >
                  Get some test tokens!
                </a>
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
                </TabsList>
                <TabsContent value="vendor">
                  <div className="grid justify-items-stretch grid-cols-2 gap-2 mt-4">
                    <VendorRealData />
                    <OpenChannel />
                  </div>
                </TabsContent>
                <TabsContent value="stream">
                  <HashStreaming />
                </TabsContent>
                <TabsContent value="admin">
                  <AdminPanel />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </>
      </div>
    </div>
  );
};
