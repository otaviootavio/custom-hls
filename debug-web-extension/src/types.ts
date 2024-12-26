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

export interface HashchainData {
  chainId: string;
  vendorAddress: string;
  amountPerHash: string;
  numHashes: string;
  contractAddress: string;
  totalAmount: string;
  secret?: string;
  lastHashIndex: number;
}

export interface HashchainInfo {
  vendorAddress: string;
  chainId: string;
}

export interface ExtensionContextType {
  // Selected hashchain management
  selectedHashchain: HashchainData | null;
  setSelectedHashchain: (data: HashchainData) => void;

  // Vendor data operations
  storeVendorData: (
    data: Pick<HashchainData, "chainId" | "vendorAddress" | "amountPerHash">
  ) => void;
  getVendorData: () => Pick<
    HashchainData,
    "chainId" | "vendorAddress" | "amountPerHash"
  > | null;

  // Contract operations
  updateContractAddress: (address: string) => void;

  // Hash operations
  getNextHash: () => string;
  getFullHashchain: () => string[];
  getSecret: () => string;
  forceSync: (lastHashIndex: number) => void;

  // Channel state
  lastHashIndex: number;

  // Read operations
  readHashchain: () => HashchainData | null;
  listHashchains: () => HashchainInfo[];
}
