import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Wallet, Hash, CircleXIcon, ShieldCheck } from "lucide-react";
import { SelectedHashchainDisplay } from "./SelectedHashchainDisplay";
import { VendorMockSetup } from "./VendorMockSetup";
import { OpenChannel } from "./OpenChannel";
import { HashStreaming } from "./HashStreaming";
import { CloseChannel } from "./CloseChannel";
import { AdminPanel } from "./AdminPanel";
import DownloadLinks from "./DownloadLinks";

export const HashchainDebug = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Hashchain Debug Client
        </h1>

        <div className="mb-6">
          <DownloadLinks />
        </div>

        <SelectedHashchainDisplay />

        <Tabs defaultValue="vendor" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="vendor"
              className="flex items-center justify-center"
            >
              <div className="flex items-center">
                <Store className="h-4 w-4 mr-2" />
                <span>Vendor Setup</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="open"
              className="flex items-center justify-center"
            >
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                <span>Open Channel</span>
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
            <VendorMockSetup />
          </TabsContent>

          <TabsContent value="open">
            <OpenChannel />
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
    </div>
  );
};
