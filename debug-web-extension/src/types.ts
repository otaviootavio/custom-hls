export interface ChannelData {
    chainId: string;
    vendorAddress: string;
    amountPerHash: string;
    numHashes: string;
    contractAddress: string;
    totalAmount: string;
  }
  
  export interface VendorInfoProps {
    channelData: ChannelData;
    vendorInfoFetched: boolean;
    onFetchVendorInfo: () => void;
  }
  
  export interface ChannelConfigProps {
    channelData: ChannelData;
    vendorInfoFetched: boolean;
    onHashCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export interface ContractDeploymentProps {
    channelData: ChannelData;
    vendorInfoFetched: boolean;
    onDeployContract: () => void;
  }
  
  export interface VendorDataPanelProps {
    channelData: ChannelData;
  }
  
  export interface HashStreamingProps {
    paymentMode: string;
    lastHashIndex: number;
    channelData: ChannelData;
    onPaymentModeChange: (mode: string) => void;
    onRequestHash: () => void;
  }
  
  export interface ChannelCloseProps {
    channelData: ChannelData;
    lastHashIndex: number;
  }
  