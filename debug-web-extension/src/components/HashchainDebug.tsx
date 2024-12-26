import { ChannelData } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Send, Store, Wallet } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { VendorInfoSection } from "./VendorInfoSection";
import { ChannelConfiguration } from "./ChannelConfiguration";
import { ContractDeployment } from "./ContractDeployment";
import { VendorDataPanel } from "./VendorDataPanel";
import { HashStreaming } from "./HashStreaming";
import { ChannelClose } from "./ChannelClose";
import { VendorMockSetup } from "./VendorMockSetup";

export const HashchainDebug = () => {
  const [channelData, setChannelData] = useState<ChannelData>({
    chainId: '',
    vendorAddress: '',
    amountPerHash: '',
    numHashes: '',
    contractAddress: '',
    totalAmount: '0'
  });

  const [paymentMode, setPaymentMode] = useState('pop');
  const [vendorInfoFetched, setVendorInfoFetched] = useState(false);
  const [lastHashIndex, setLastHashIndex] = useState(0);

  const handleHashCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numHashes = e.target.value;
    const totalAmount = (parseFloat(numHashes || '0') * parseFloat(channelData.amountPerHash || '0')).toString();
    setChannelData(prev => ({
      ...prev,
      numHashes,
      totalAmount
    }));
  };

  const handleSetVendorData = (data: {
    chainId: string;
    vendorAddress: string;
    amountPerHash: string;
  }) => {
    // In a real implementation, this would interact with the extension
    alert("Mock: Vendor data saved to extension successfully!");
  };

  const mockFetchVendorInfo = () => {
    setChannelData(prev => ({
      ...prev,
      chainId: '0x5',
      vendorAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      amountPerHash: '0.001',
      totalAmount: '0'
    }));
    setVendorInfoFetched(true);
  };

  const mockDeployContract = () => {
    setChannelData(prev => ({
      ...prev,
      contractAddress: '0x123...abc'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Hashchain Debug Client
        </h1>

        <Tabs defaultValue="vendor" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vendor" className="flex items-center justify-center">
              <div className="flex items-center">
                <Store className="h-4 w-4 mr-2" />
                <span>Vendor Setup</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="open" className="flex items-center justify-center">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                <span>Open Channel</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center justify-center">
              <div className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                <span>Stream Hashes</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="close" className="flex items-center justify-center">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                <span>Close Channel</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendor">
            <VendorMockSetup onSetVendorData={handleSetVendorData} />
          </TabsContent>

          <TabsContent value="open">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Payment Channel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <VendorInfoSection
                    channelData={channelData}
                    vendorInfoFetched={vendorInfoFetched}
                    onFetchVendorInfo={mockFetchVendorInfo}
                  />
                  <ChannelConfiguration
                    channelData={channelData}
                    vendorInfoFetched={vendorInfoFetched}
                    onHashCountChange={handleHashCountChange}
                  />
                  <ContractDeployment
                    channelData={channelData}
                    vendorInfoFetched={vendorInfoFetched}
                    onDeployContract={mockDeployContract}
                  />
                </CardContent>
              </Card>
              <VendorDataPanel channelData={channelData} />
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <HashStreaming
              paymentMode={paymentMode}
              lastHashIndex={lastHashIndex}
              channelData={channelData}
              onPaymentModeChange={setPaymentMode}
              onRequestHash={() => setLastHashIndex(prev => prev + 1)}
            />
          </TabsContent>

          <TabsContent value="close">
            <ChannelClose
              channelData={channelData}
              lastHashIndex={lastHashIndex}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};